import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as os from 'os';
import { BlameLineInfo } from './blameDecorator';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export class BlameCacheManager {
    private cacheDir: string;

    constructor() {
        // 在用户主目录下创建 .git-graph/blame-cache 目录
        this.cacheDir = path.join(os.homedir(), '.git-graph', 'blame-cache');
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true } as any);
        }
    }

    private getCacheKey(filePath: string): string {
        return crypto.createHash('md5').update(filePath).digest('hex');
    }

    private getCachePath(filePath: string): string {
        return path.join(this.cacheDir, this.getCacheKey(filePath) + '.json');
    }

    public async get(filePath: string): Promise<BlameLineInfo[] | null> {
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
            console.error('Error reading blame cache:', error);
        }
        
        return null;
    }

    public async set(filePath: string, blameInfo: BlameLineInfo[]): Promise<void> {
        const cachePath = this.getCachePath(filePath);
        
        try {
            await writeFileAsync(cachePath, JSON.stringify(blameInfo), 'utf8');
        } catch (error) {
            console.error('Error writing blame cache:', error);
        }
    }

    public async clear(filePath: string): Promise<void> {
        const cachePath = this.getCachePath(filePath);
        
        try {
            if (fs.existsSync(cachePath)) {
                await unlinkAsync(cachePath);
            }
        } catch (error) {
            console.error('Error clearing blame cache:', error);
        }
    }
} 