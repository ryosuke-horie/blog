// Qiita API v2にアクセスし、記事を取得する。
import axios from 'axios';

// APIキーを環境変数から取得
const API_KEY = process.env.QIITA_API;

/**
 * Qiita API v2にアクセスし、記事を取得する。
 * @param {number} perPage 取得する記事の数
 */
export async function getQiitaPosts(perPage = 4) {
    if (!API_KEY) {
        throw new Error('APIキーが設定されていません。');
    }

    try {
        const res = await axios.get(
            `https://qiita.com/api/v2/authenticated_user/items?page=1&per_page=${perPage}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + API_KEY,
                },
            }
        );

        return res.data;
    } catch (error) {
        throw new Error('記事の取得に失敗しました。');
    }
}