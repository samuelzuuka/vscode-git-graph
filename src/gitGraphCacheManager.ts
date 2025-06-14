import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as os from 'os';
import { promisify } from 'util';
import * as vscode from 'vscode';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export class GitGraphCacheManager {
    private cacheDir: string;
    private subdirName: string;

    public static TYPE_AUTHORS: string = 'authors';
    public static TYPE_BLAMEINFO: string = 'blame-info';

    private constructor(subdirName: string) {
        this.subdirName = subdirName;
        // 在用户主目录下创建 .git-graph/<subdirName> 目录
        this.cacheDir = path.join(os.homedir(), '.git-graph', subdirName);
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true } as any);
        }
    }

    public static getBlameInfoCacheManager(): GitGraphCacheManager {
        return new GitGraphCacheManager(GitGraphCacheManager.TYPE_BLAMEINFO);
    }

    public static getAuthorsCacheManager(): GitGraphCacheManager {
        return new GitGraphCacheManager(GitGraphCacheManager.TYPE_AUTHORS);
    }

    private getCacheKey(filePath: string): string {
        return crypto.createHash('md5').update(filePath).digest('hex');
    }

    private getCachePath(filePath: string): string {
        return path.join(this.cacheDir, this.getCacheKey(filePath) + '.json');
    }

    public async get(filePath: string): Promise<any | null> {
        const cachePath = this.getCachePath(filePath);
        
        try {
            if (fs.existsSync(cachePath)) {
                const stats = fs.statSync(filePath);
                const cacheStats = fs.statSync(cachePath);
                
                // 如果文件修改时间晚于缓存时间，返回null以触发重新获取
                if (stats.mtimeMs > cacheStats.mtimeMs) {
                    return null;
                }

                const cacheContent = await readFileAsync(cachePath, 'utf8');
                return JSON.parse(cacheContent);
            }
        } catch (error) {
            console.error(`Error reading ${this.subdirName} cache:`, error);
        }
        
        return null;
    }

    public async set(filePath: string, cacheValue: any): Promise<void> {
        const cachePath = this.getCachePath(filePath);
        
        try {
            await writeFileAsync(cachePath, JSON.stringify(cacheValue), 'utf8');
        } catch (error) {
            console.error(`Error writing ${this.subdirName} cache:`, error);
        }
    }

    public async clear(filePath: string): Promise<void> {
        const cachePath = this.getCachePath(filePath);
        
        try {
            if (fs.existsSync(cachePath)) {
                await unlinkAsync(cachePath);
            }
        } catch (error) {
            console.error(`Error clearing ${this.subdirName} cache:`, error);
        }
    }

    /**
     * 清楚全部缓存文件
     */
    public static clearAll(): void {
        try {
            const clearTypes = [GitGraphCacheManager.TYPE_AUTHORS, GitGraphCacheManager.TYPE_BLAMEINFO];
            clearTypes.forEach((type) => {
                const cacheDir = path.join(os.homedir(), '.git-graph', type);
                if (fs.existsSync(cacheDir)) {
                    try {
                        deleteFolderRecursive(cacheDir);
                    } catch (err) {
                        console.error('清除缓存文件失败:', err);
                        vscode.window.showErrorMessage('Git Graph : 清除缓存文件失败:' + err);
                    }
                }
            });
        } catch (error) {
            console.error('清除缓存文件失败:', error);
            vscode.window.showErrorMessage('Git Graph : 清除缓存文件失败:' + error);
        }
    }

}

// 递归删除目录及其内容，兼容 Node.js 8
function deleteFolderRecursive(dirPath: string) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
} 