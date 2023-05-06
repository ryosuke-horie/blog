// Qiita API v2にアクセスし、記事を取得する。
import axios from 'axios';

const API_KEY = process.env.QIITA_API;

export async function getQiitaPosts() {
    const res = await axios.get('https://qiita.com/api/v2/authenticated_user/items?page=1&per_page=1', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY,
        }
    })

    return res
}