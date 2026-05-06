import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  App as AntdApp,
  Button,
  Card,
  Form,
  Input,
  Layout,
  Menu,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

type SiteContentInput = {
  companyName: string
  slogan: string
  home: {
    title: string
    subtitle: string
    primaryAction: {
      label: string
      href: string
    }
  }
}

type SiteContent = SiteContentInput & {
  updatedAt: string
  updatedBy: string
  createdBy: string
}

type LoginResponse = {
  accessToken: string
  expiresIn: string
  username: string
}

type StatusMessage = {
  type: 'success' | 'error'
  text: string
}

const AUTH_TOKEN_KEY = 'admin_access_token'
const AUTH_USER_KEY = 'admin_username'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api'

function App() {
  const [contentForm] = Form.useForm<SiteContentInput>()
  const [loginForm] = Form.useForm<{ username: string; password: string }>()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [preview, setPreview] = useState<SiteContent | null>(null)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [token, setToken] = useState<string>('')
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const localToken = window.localStorage.getItem(AUTH_TOKEN_KEY) ?? ''
    const localUser = window.localStorage.getItem(AUTH_USER_KEY) ?? ''
    setToken(localToken)
    setUsername(localUser)
  }, [])

  const isAuthed = useMemo(() => token.length > 0, [token])

  function handleLogout() {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    window.localStorage.removeItem(AUTH_USER_KEY)
    setToken('')
    setUsername('')
    setPreview(null)
    contentForm.resetFields()
    setStatusMessage({ type: 'success', text: '已退出登录。' })
  }

  async function loadAdminSiteContent(currentToken: string) {
    setLoading(true)
    setStatusMessage(null)

    try {
      const response = await fetch(`${apiBaseUrl}/admin/site-content`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })

      if (response.status === 401) {
        handleLogout()
        setStatusMessage({ type: 'error', text: '登录态已失效，请重新登录。' })
        return
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const payload = (await response.json()) as SiteContent
      contentForm.setFieldsValue({
        companyName: payload.companyName,
        slogan: payload.slogan,
        home: payload.home,
      })
      setPreview(payload)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setStatusMessage({ type: 'error', text: `加载官网内容失败：${message}` })
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(values: { username: string; password: string }) {
    setLoggingIn(true)
    setStatusMessage(null)

    try {
      const response = await fetch(`${apiBaseUrl}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(response.status === 401 ? '用户名或密码错误' : `Request failed: ${response.status}`)
      }

      const payload = (await response.json()) as LoginResponse
      window.localStorage.setItem(AUTH_TOKEN_KEY, payload.accessToken)
      window.localStorage.setItem(AUTH_USER_KEY, payload.username)
      setToken(payload.accessToken)
      setUsername(payload.username)
      setStatusMessage({ type: 'success', text: `登录成功，欢迎 ${payload.username}` })
      await loadAdminSiteContent(payload.accessToken)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setStatusMessage({ type: 'error', text: `登录失败：${message}` })
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleSave(values: SiteContentInput) {
    if (!token) {
      setStatusMessage({ type: 'error', text: '请先登录后再保存。' })
      return
    }

    setSaving(true)
    setStatusMessage(null)

    try {
      const response = await fetch(`${apiBaseUrl}/admin/site-content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })

      if (response.status === 401) {
        handleLogout()
        setStatusMessage({ type: 'error', text: '登录态已失效，请重新登录。' })
        return
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const payload = (await response.json()) as SiteContent
      setPreview(payload)
      setStatusMessage({ type: 'success', text: '保存成功，官网读取到的内容已经更新。' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setStatusMessage({ type: 'error', text: `保存失败：${message}` })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!token) {
      return
    }

    void loadAdminSiteContent(token)
  }, [token])

  if (!isAuthed) {
    return (
      <AntdApp>
        <main className="login-shell">
          <Card title="管理后台登录" className="login-card">
            <Space direction="vertical" size={16} style={{ display: 'flex' }}>
              {statusMessage ? <Alert type={statusMessage.type} showIcon message={statusMessage.text} /> : null}
              <Form layout="vertical" form={loginForm} onFinish={handleLogin}>
                <Form.Item
                  label="用户名"
                  name="username"
                  initialValue="admin"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input autoComplete="username" />
                </Form.Item>
                <Form.Item
                  label="密码"
                  name="password"
                  initialValue="admin123456"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password autoComplete="current-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loggingIn} block>
                  登录
                </Button>
              </Form>
            </Space>
          </Card>
        </main>
      </AntdApp>
    )
  }

  return (
    <AntdApp>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={220} theme="light">
          <div className="brand">Admin Web</div>
          <Menu mode="inline" defaultSelectedKeys={['content']} items={[{ key: 'content', label: '官网内容管理' }]} />
        </Sider>
        <Layout>
          <Header className="admin-header">
            <Title level={4} style={{ margin: 0 }}>
              官网管理后台
            </Title>
            <Space>
              <Tag color="blue">{username}</Tag>
              <Tag color="green">API: {apiBaseUrl}</Tag>
              <Button size="small" onClick={handleLogout}>
                退出
              </Button>
            </Space>
          </Header>
          <Content className="admin-content">
            <Space direction="vertical" size={16} style={{ display: 'flex' }}>
              {statusMessage ? <Alert type={statusMessage.type} showIcon message={statusMessage.text} /> : null}

              <Card title="编辑官网内容">
                <Spin spinning={loading}>
                  <Form layout="vertical" form={contentForm} onFinish={handleSave}>
                    <Form.Item name="companyName" label="公司名称" rules={[{ required: true, message: '请输入公司名称' }]}>
                      <Input placeholder="例如：Acme Digital Co." />
                    </Form.Item>

                    <Form.Item name="slogan" label="品牌标语" rules={[{ required: true, message: '请输入品牌标语' }]}>
                      <Input placeholder="例如：Build once, publish everywhere" />
                    </Form.Item>

                    <Form.Item name={['home', 'title']} label="首页主标题" rules={[{ required: true, message: '请输入首页主标题' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item name={['home', 'subtitle']} label="首页副标题" rules={[{ required: true, message: '请输入首页副标题' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name={['home', 'primaryAction', 'label']}
                      label="主按钮文案"
                      rules={[{ required: true, message: '请输入主按钮文案' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name={['home', 'primaryAction', 'href']}
                      label="主按钮链接"
                      rules={[{ required: true, message: '请输入主按钮链接' }]}
                    >
                      <Input placeholder="例如：/contact" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={saving}>
                      保存并发布到官网
                    </Button>
                  </Form>
                </Spin>
              </Card>

              <Card title="官网读取预览">
                {preview ? (
                  <Space direction="vertical" size={4}>
                    <Text>
                      <strong>公司：</strong>
                      {preview.companyName}
                    </Text>
                    <Text>
                      <strong>标语：</strong>
                      {preview.slogan}
                    </Text>
                    <Text>
                      <strong>首页标题：</strong>
                      {preview.home.title}
                    </Text>
                    <Text>
                      <strong>首页副标题：</strong>
                      {preview.home.subtitle}
                    </Text>
                    <Text>
                      <strong>按钮：</strong>
                      {preview.home.primaryAction.label} ({preview.home.primaryAction.href})
                    </Text>
                    <Text type="secondary">
                      审计：创建人 {preview.createdBy} ｜ 最近更新人 {preview.updatedBy} ｜ 更新时间{' '}
                      {new Date(preview.updatedAt).toLocaleString()}
                    </Text>
                  </Space>
                ) : (
                  <Text type="secondary">暂无数据</Text>
                )}
              </Card>
            </Space>
          </Content>
        </Layout>
      </Layout>
    </AntdApp>
  )
}

export default App
