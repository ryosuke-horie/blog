// lib/qiita.jsのテストを作成する。
import axios from 'axios';
import { getQiitaPosts } from '../../lib/qiita';

const API_KEY = process.env.QIITA_API;

// axios モジュールをモックする
jest.mock('axios');

/**
 * APIリクエストが正常に行われることを確認する。
 */
describe('lib/qiita.js', () => {
  describe('getQiitaPosts', () => {
    it('should request to Qiita API', async () => {
      // モックされたレスポンスを定義する
      const mockResponse = { data: 'test' };
      axios.get.mockResolvedValue(mockResponse); // モックされたレスポンスを返す

      // 関数を呼び出す
      const res = await getQiitaPosts();

      // axios.get メソッドが呼び出されることを確認する。
      expect(axios.get).toHaveBeenCalled();
      
      // axios.get メソッドが正しい引数で呼び出されることを確認する。
      expect(axios.get).toHaveBeenCalledWith(
        'https://qiita.com/api/v2/authenticated_user/items?page=1&per_page=4',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY,
          }
        }
      );

      // 返されたデータが適切に処理されていることを確認する。
      expect(res.data).toEqual('test');
    });
  });
});



// デフォルトの記事数が正しく設定されていること:
// perPage 引数を指定せずに関数を呼び出した場合、デフォルトの記事数が4であることを確認する。

// perPage 引数が正しく機能していること:
// perPage 引数に異なる値を指定して関数を呼び出し、指定した数の記事が返されることを確認する。

// 正常なレスポンスが返された場合の処理が正しいこと:
// レスポンスが正常であることを確認する。
// 返されたデータが適切に処理されていることを確認する。
// 必要な情報が取得できていることを確認する。

// エラーが発生した場合の処理が正しいこと:
// リクエストが失敗した場合にエラーハンドリングが行われていることを確認する。
// エラーレスポンスが適切に処理されていることを確認する。
// 適切なエラーメッセージやエラーコードが返されていることを確認する。

// 環境変数 QIITA_API の設定が正しいこと:
// API_KEY 変数が環境変数から正しく読み込まれていることを確認する。
// 環境変数が設定されていない場合に適切なエラーハンドリングが行われていることを確認する。