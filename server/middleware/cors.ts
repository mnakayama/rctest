import { defineEventHandler, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  })

  // OPTIONSリクエスト（プリフライトリクエスト）の場合は、ここで処理を終了
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
})
