import * as vscode from 'vscode';
import { Disposable } from './utils/disposable';
/**
 * BlameDecorator - 在每行代码行尾显示最后一次提交信息，并支持悬浮显示详细信息。
 */
export class BlameDecorator extends Disposable {
    private decorationType: vscode.TextEditorDecorationType;
    private blameCache: Map<string, BlameLineInfo[]> = new Map();

    constructor() {
    	super();
    	this.decorationType = vscode.window.createTextEditorDecorationType({
    		after: {
    			color: new vscode.ThemeColor('descriptionForeground'),
    			margin: '0 0 0 2em'
    		},
    		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
    	});
    	this.registerListeners();
    }

    private registerListeners() {
    	this.registerDisposables(
    		vscode.window.onDidChangeActiveTextEditor(() => this.updateDecorations()),
    		vscode.window.onDidChangeTextEditorSelection(() => this.updateDecorations()),
    		vscode.workspace.onDidChangeTextDocument(() => this.updateDecorations()),
    		vscode.workspace.onDidSaveTextDocument(() => this.updateDecorations()),
    		vscode.languages.registerHoverProvider({ scheme: 'file' }, {
    			provideHover: (document, position) => this.provideHover(document, position)
    		})
    	);
    	this.updateDecorations();
    }

    private async updateDecorations() {
    	showMessage('[BlameDecorator] updateDecorations called', 'info');
    	const editor = vscode.window.activeTextEditor;
    	if (!editor || editor.document.isUntitled) return;
    	const filePath = editor.document.uri.fsPath;
    	const repo = await this.getRepoPath(filePath);
    	showMessage('[BlameDecorator] getRepoPath: ' + repo, 'info');
    	if (!repo) return;

    	let blameLines = this.blameCache.get(filePath);
    	if (!blameLines) {
    		blameLines = await this.getBlameInfo(repo, filePath);
    		this.blameCache.set(filePath, blameLines);
    	}
    	if (!blameLines) return;
    	showMessage('[BlameDecorator] blameLines.length: ' + blameLines.length + ' document.lineCount: ' + editor.document.lineCount, 'info');

    	// 只显示光标所在行的装饰
    	const selections = editor.selections;
    	const lines = new Set<number>();
    	for (const sel of selections) {
    		lines.add(sel.active.line);
    	}
    	const decorations: vscode.DecorationOptions[] = [];
    	for (const line of lines) {
    		const info = blameLines[line];
    		if (!info) continue;
    		decorations.push({
    			range: new vscode.Range(line, editor.document.lineAt(line).range.end.character, line, editor.document.lineAt(line).range.end.character),
    			renderOptions: {
    				after: {
    					contentText: ` ${info.author} • ${info.time} • ${info.summary}`,
    					color: '#999999',
    					fontStyle: 'italic'
    				}
    			},
    			// hoverMessage: new vscode.MarkdownString(
    			// 	`**${info.author}**  \n${info.time}  \n${info.summary}  \nCommit: \`${info.hash}\``
    			// )
    		});
    	}
    	showMessage('[BlameDecorator] decorations.length: ' + decorations.length, 'info');
    	editor.setDecorations(this.decorationType, decorations);
    }

    private async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | undefined> {
    	const filePath = document.uri.fsPath;
    	const blameLines = this.blameCache.get(filePath);
    	if (!blameLines) return;
    	const line = position.line;
    	const info = blameLines[line];
    	if (!info) return;
    	const repo = await this.getRepoPath(filePath);
    	const md = new vscode.MarkdownString();
    	md.appendMarkdown(`**作者**: ${info.author}  \n`);
    	md.appendMarkdown(`**时间**: ${info.time}  \n`);
    	md.appendMarkdown(`**摘要**: ${info.summary}  \n`);
    	md.appendMarkdown(`**提交哈希**: \`${info.hash}\``);
    	if (repo) {
    		md.appendMarkdown(`\n\n[跳转到提交](command:git-graph.viewCommit?${encodeURIComponent(JSON.stringify([repo, info.hash]))} "在Git Graph中查看此提交")`);
    	}
    	md.isTrusted = true;
    	return new vscode.Hover(md);
    }

    private async getRepoPath(filePath: string): Promise<string | null> {
    	// TODO: 可根据项目实际情况优化获取repo路径的方式
    	// 这里假设文件路径中包含.git目录的上级为repo根目录
    	let dir = filePath;
    	const path = require('path');
    	const fs = require('fs');
    	while (dir !== path.dirname(dir)) {
    		if (fs.existsSync(path.join(dir, '.git'))) {
    			showMessage('[BlameDecorator] Found repo root: ' + dir, 'info');
    			return dir;
    		}
    		dir = path.dirname(dir);
    	}
    	showMessage('[BlameDecorator] Repo root not found for: ' + filePath, 'info');
    	return null;
    }

    private async getBlameInfo(repo: string, filePath: string): Promise<BlameLineInfo[]> {
    	// 通过git blame命令获取每行的提交信息
    	return new Promise((resolve) => {
    		const cp = require('child_process');
    		cp.exec(`git blame --line-porcelain "${filePath}"`, { cwd: repo }, (err: any, stdout: string) => {
    			if (err) {
    				showMessage('[BlameDecorator] git blame error: ' + err, 'info');
    				return resolve([]);
    			}
    			const lines = stdout.split('\n');
    			const result: BlameLineInfo[] = [];
    			let current: Partial<BlameLineInfo> = {};
    			for (const line of lines) {
    				if (/^[0-9a-f]{40} /.test(line)) {
    					if (current.hash) result.push(current as BlameLineInfo);
    					current = { hash: line.split(' ')[0] };
    				} else if (line.startsWith('author ')) {
    					current.author = line.replace('author ', '');
    				} else if (line.startsWith('summary ')) {
    					current.summary = line.replace('summary ', '');
    				} else if (line.startsWith('author-time ')) {
    					const ts = parseInt(line.replace('author-time ', '')) * 1000;
    					current.time = new Date(ts).toLocaleString();
    				}
    			}
    			if (current.hash) result.push(current as BlameLineInfo);
    			showMessage('[BlameDecorator] getBlameInfo result.length: ' + result.length, 'info');
    			resolve(result);
    		});
    	});
    }

    public dispose() {
    	this.decorationType.dispose();
    	super.dispose();
    }
}

interface BlameLineInfo {
    hash: string;
    author: string;
    time: string;
    summary: string;
}

function showMessage(message: string, type: 'info' | 'warn' | 'error' = 'info') {
    // console.log("["+type+"]"+message);
    // switch (type) {
	// 	case 'info':
    //         vscode.window.showInformationMessage(message);
	// 		break;
	// 	case 'warn':
	// 		vscode.window.showWarningMessage(message);
	// 		break;
	// 	case 'error':
	// 		vscode.window.showErrorMessage(message);
	// 		break;
	// }
}
