export default function TestPage() {
  return (
    <div style={{ padding: '20px', color: '#fff', background: '#000', minHeight: '100vh' }}>
      <h1>🎉 ТЕСТ СТРАНИЦА РАБОТАЕТ!</h1>
      <p>Если ты видишь это - Next.js запущен!</p>
      <ul>
        <li>✅ Next.js работает</li>
        <li>✅ React работает</li>
        <li>✅ TypeScript работает</li>
      </ul>
      <p>
        <a href="/test-api" style={{ color: '#60a5fa' }}>→ Тест API Supabase</a>
      </p>
      <p>
        <a href="/" style={{ color: '#60a5fa' }}>→ На главную</a>
      </p>
    </div>
  )
}