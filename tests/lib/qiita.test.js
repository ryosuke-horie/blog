import axios from 'axios';
import { getQiitaPosts } from '../../lib/qiita';
import dotenv from 'dotenv';

// dotenvパッケージを使用して環境変数を読み込む
dotenv.config({ path: '.env' });

const API_KEY = process.env.QIITA_API;

jest.mock('axios');

describe('lib/qiita.js', () => {
  describe('getQiitaPosts', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('APIリクエストが正しいURLで呼び出されることを確認', async () => {
      const perPage = 4;
      const expectedUrl = `https://qiita.com/api/v2/authenticated_user/items?page=1&per_page=${perPage}`;
      const mockResponse = { data: 'test' };
      axios.get.mockResolvedValue(mockResponse);

      const res = await getQiitaPosts();

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY,
        },
      });

      expect(res).toEqual('test');
    });

    it('perPage 引数が正しく機能していること', async () => {
      const perPage = 4;
      const expectedUrl = `https://qiita.com/api/v2/authenticated_user/items?page=1&per_page=${perPage}`;
      const mockPosts = [
        { id: 1, title: '記事1' },
        { id: 2, title: '記事2' },
        { id: 3, title: '記事3' },
        { id: 4, title: '記事4' },
      ];

      axios.get.mockResolvedValue({ data: mockPosts });

      const result = await getQiitaPosts(perPage);

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY,
        },
      });

      expect(result).toEqual(mockPosts);
    });

    it('正常なレスポンスが返された場合の処理が正しいこと', async () => {
      const perPage = 4;
      const expectedUrl = `https://qiita.com/api/v2/authenticated_user/items?page=1&per_page=${perPage}`;
      const mockPosts = [
        { id: 1, title: '記事1' },
        { id: 2, title: '記事2' },
        { id: 3, title: '記事3' },
        { id: 4, title: '記事4' },
      ];

      axios.get.mockResolvedValue({ data: mockPosts });

      const result = await getQiitaPosts(perPage);

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY,
        },
      });

      expect(result).toEqual(mockPosts);

      // レスポンスが正常であることを確認する
      expect(result).toEqual(mockPosts);

      // 返されたデータが適切に処理されていることを確認する
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(perPage);
    });

    it('エラーが発生した場合の処理が正しいこと', async () => {
      const perPage = 4;
      const expectedUrl = `https://qiita.com/api/v2/authenticated_user/items?page=1&per_page=${perPage}`;
      const errorMessage = 'リクエストが失敗しました。';
      const errorCode = 500;

      axios.get.mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
            code: errorCode,
          },
        },
      });

      try {
        await getQiitaPosts(perPage);
        fail('エラーがスローされることを期待しましたが、スローされませんでした。');
      } catch (error) {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY,
          },
        });

        expect(error.message).toBe('記事の取得に失敗しました。');
      }
    });
  });
});