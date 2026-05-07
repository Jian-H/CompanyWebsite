import { useEffect, useState } from 'react'
import {
  Alert,
  App as AntdApp,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { FormInstance } from 'antd'
import {
  AppstoreOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  PlusOutlined,
  SaveOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

type MenuKey = 'home' | 'products' | 'solutions' | 'articles' | 'users'
type StatusMessage = { type: 'success' | 'error'; text: string }
type LoginResponse = { accessToken: string; username: string; role: string }
type CmsRecord = Record<string, unknown> & { id?: number; sortOrder?: number; isEnabled?: boolean; isPublished?: boolean }

type HomePageData = {
  setting: Record<string, unknown>
  hero: Record<string, unknown>
  advantages: CmsRecord[]
  products: CmsRecord[]
  solutions: CmsRecord[]
  articles: CmsRecord[]
}

const AUTH_TOKEN_KEY = 'admin_access_token'
const AUTH_USER_KEY = 'admin_username'
const AUTH_ROLE_KEY = 'admin_role'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api'

function App() {
  const [loginForm] = Form.useForm()
  const [homeForm] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [userForm] = Form.useForm()

  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')
  const [activeMenu, setActiveMenu] = useState<MenuKey>('home')
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [homePage, setHomePage] = useState<HomePageData | null>(null)
  const [products, setProducts] = useState<CmsRecord[]>([])
  const [solutions, setSolutions] = useState<CmsRecord[]>([])
  const [articles, setArticles] = useState<CmsRecord[]>([])
  const [users, setUsers] = useState<CmsRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [modalState, setModalState] = useState<{ type: MenuKey; record?: CmsRecord } | null>(null)
  const [userModalOpen, setUserModalOpen] = useState(false)

  useEffect(() => {
    setToken(localStorage.getItem(AUTH_TOKEN_KEY) ?? '')
    setUsername(localStorage.getItem(AUTH_USER_KEY) ?? '')
    setRole(localStorage.getItem(AUTH_ROLE_KEY) ?? '')
  }, [])

  useEffect(() => {
    if (token) {
      void refreshAll()
    }
  }, [token])

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    })

    if (response.status === 401) {
      handleLogout()
      throw new Error('登录态已失效，请重新登录')
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return response.json() as Promise<T>
  }

  async function handleLogin(values: { username: string; password: string }) {
    setLoading(true)
    setStatusMessage(null)
    try {
      const response = await fetch(`${apiBaseUrl}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        throw new Error('用户名或密码错误')
      }
      const payload = (await response.json()) as LoginResponse
      localStorage.setItem(AUTH_TOKEN_KEY, payload.accessToken)
      localStorage.setItem(AUTH_USER_KEY, payload.username)
      localStorage.setItem(AUTH_ROLE_KEY, payload.role)
      setToken(payload.accessToken)
      setUsername(payload.username)
      setRole(payload.role)
      setStatusMessage({ type: 'success', text: '登录成功' })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error instanceof Error ? error.message : '登录失败' })
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_ROLE_KEY)
    setToken('')
    setUsername('')
    setRole('')
  }

  async function refreshAll() {
    setLoading(true)
    try {
      const [home, productList, solutionList, articleList, userList] = await Promise.all([
        request<HomePageData>('/admin/home-page'),
        request<CmsRecord[]>('/admin/products'),
        request<CmsRecord[]>('/admin/solutions'),
        request<CmsRecord[]>('/admin/articles'),
        request<CmsRecord[]>('/admin/users'),
      ])
      setHomePage(home)
      setProducts(productList)
      setSolutions(solutionList)
      setArticles(articleList)
      setUsers(userList)
      homeForm.setFieldsValue({
        setting: home.setting,
        hero: home.hero,
        advantages: home.advantages,
      })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error instanceof Error ? error.message : '加载失败' })
    } finally {
      setLoading(false)
    }
  }

  async function saveHomePage(values: Record<string, unknown>) {
    setLoading(true)
    try {
      const updated = await request<HomePageData>('/admin/home-page', {
        method: 'PUT',
        body: JSON.stringify(values),
      })
      setHomePage(updated)
      setStatusMessage({ type: 'success', text: '首页内容已发布' })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error instanceof Error ? error.message : '保存失败' })
    } finally {
      setLoading(false)
    }
  }

  function openRecordModal(type: MenuKey, record?: CmsRecord) {
    setModalState({ type, record })
    modalForm.setFieldsValue(record ?? defaultRecord(type))
  }

  async function saveRecord(values: CmsRecord) {
    if (!modalState) {
      return
    }
    const endpoint = endpointFor(modalState.type)
    const method = modalState.record?.id ? 'PUT' : 'POST'
    const path = modalState.record?.id ? `${endpoint}/${modalState.record.id}` : endpoint
    await request(path, { method, body: JSON.stringify(values) })
    setModalState(null)
    modalForm.resetFields()
    setStatusMessage({ type: 'success', text: '内容已保存' })
    await refreshAll()
  }

  async function deleteRecord(type: MenuKey, id: number) {
    await request(`${endpointFor(type)}/${id}`, { method: 'DELETE' })
    setStatusMessage({ type: 'success', text: '内容已删除' })
    await refreshAll()
  }

  async function createUser(values: Record<string, unknown>) {
    await request('/admin/users', { method: 'POST', body: JSON.stringify(values) })
    setUserModalOpen(false)
    userForm.resetFields()
    setStatusMessage({ type: 'success', text: '账号已创建' })
    await refreshAll()
  }

  if (!token) {
    return (
      <AntdApp>
        <main className="login-shell">
          <Card className="login-card" title="AuroraTech 管理后台">
            <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
              {statusMessage ? <Alert showIcon type={statusMessage.type} message={statusMessage.text} /> : null}
              <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
                <Form.Item name="username" label="用户名" initialValue="admin" rules={[{ required: true }]}>
                  <Input autoComplete="username" />
                </Form.Item>
                <Form.Item name="password" label="密码" initialValue="admin123456" rules={[{ required: true }]}>
                  <Input.Password autoComplete="current-password" />
                </Form.Item>
                <Button block htmlType="submit" loading={loading} type="primary">登录</Button>
              </Form>
            </Space>
          </Card>
        </main>
      </AntdApp>
    )
  }

  return (
    <AntdApp>
      <Layout className="admin-shell">
        <Sider className="admin-sider" width={238} theme="light">
          <div className="brand">AuroraTech</div>
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            onClick={({ key }) => setActiveMenu(key as MenuKey)}
            items={[
              { key: 'home', icon: <HomeOutlined />, label: '首页内容' },
              { key: 'products', icon: <AppstoreOutlined />, label: '产品管理' },
              { key: 'solutions', icon: <SolutionOutlined />, label: '方案管理' },
              { key: 'articles', icon: <FileTextOutlined />, label: '新闻/文章' },
              { key: 'users', icon: <UserOutlined />, label: '用户管理' },
            ]}
          />
        </Sider>
        <Layout>
          <Header className="admin-header">
            <Title level={4} style={{ margin: 0 }}>官网内容管理</Title>
            <Space>
              <Tag color="blue">{username}</Tag>
              <Tag>{role}</Tag>
              <Button icon={<LogoutOutlined />} onClick={handleLogout}>退出</Button>
            </Space>
          </Header>
          <Content className="admin-content">
            {statusMessage ? <Alert showIcon type={statusMessage.type} message={statusMessage.text} style={{ marginBottom: 16 }} /> : null}
            {activeMenu === 'home' ? (
              <HomeEditor form={homeForm} loading={loading} onFinish={saveHomePage} homePage={homePage} />
            ) : null}
            {activeMenu === 'products' ? (
              <RecordsTable title="产品管理" type="products" records={products} onCreate={() => openRecordModal('products')} onEdit={openRecordModal} onDelete={deleteRecord} />
            ) : null}
            {activeMenu === 'solutions' ? (
              <RecordsTable title="方案管理" type="solutions" records={solutions} onCreate={() => openRecordModal('solutions')} onEdit={openRecordModal} onDelete={deleteRecord} />
            ) : null}
            {activeMenu === 'articles' ? (
              <RecordsTable title="新闻/文章" type="articles" records={articles} onCreate={() => openRecordModal('articles')} onEdit={openRecordModal} onDelete={deleteRecord} />
            ) : null}
            {activeMenu === 'users' ? (
              <UsersTable users={users} canCreate={role === 'admin'} onCreate={() => setUserModalOpen(true)} />
            ) : null}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title={modalState?.record?.id ? '编辑内容' : '新增内容'}
        open={Boolean(modalState)}
        onCancel={() => setModalState(null)}
        onOk={() => modalForm.submit()}
        destroyOnHidden
      >
        <Form form={modalForm} layout="vertical" onFinish={saveRecord}>
          {modalState?.type === 'products' ? <ProductFields /> : null}
          {modalState?.type === 'solutions' ? <SolutionFields /> : null}
          {modalState?.type === 'articles' ? <ArticleFields /> : null}
        </Form>
      </Modal>

      <Modal title="创建用户" open={userModalOpen} onCancel={() => setUserModalOpen(false)} onOk={() => userForm.submit()} destroyOnHidden>
        <Form form={userForm} layout="vertical" onFinish={createUser}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="displayName" label="显示名称">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色" initialValue="editor">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </AntdApp>
  )
}

function HomeEditor({ form, loading, onFinish, homePage }: { form: FormInstance; loading: boolean; onFinish: (values: Record<string, unknown>) => void; homePage: HomePageData | null }) {
  return (
    <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>首页内容</Title>
            <Text type="secondary">编辑 Hero、站点信息与核心优势，产品/方案/文章在独立菜单维护。</Text>
          </div>
          <Button href="http://localhost:3000" target="_blank">打开官网</Button>
        </Space>
      </Card>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="站点设置">
          <div className="form-grid">
            <Form.Item name={['setting', 'siteName']} label="站点名称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name={['setting', 'logoText']} label="Logo 文案" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name={['setting', 'contactText']} label="联系按钮" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name={['setting', 'seoTitle']} label="SEO 标题" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name={['setting', 'seoDesc']} label="SEO 描述"><Input /></Form.Item>
          </div>
        </Card>
        <Card title="首页 Hero" style={{ marginTop: 16 }}>
          <div className="form-grid">
            <Form.Item name={['hero', 'title']} label="主标题" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name={['hero', 'highlight']} label="高亮词" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name={['hero', 'primaryLabel']} label="主按钮文案"><Input /></Form.Item>
            <Form.Item name={['hero', 'primaryHref']} label="主按钮链接"><Input /></Form.Item>
            <Form.Item name={['hero', 'secondaryLabel']} label="次按钮文案"><Input /></Form.Item>
            <Form.Item name={['hero', 'secondaryHref']} label="次按钮链接"><Input /></Form.Item>
            <Form.Item name={['hero', 'backgroundImage']} label="背景图 URL"><Input /></Form.Item>
            <Form.Item name={['hero', 'isEnabled']} label="启用" valuePropName="checked"><Switch /></Form.Item>
          </div>
          <Form.Item name={['hero', 'subtitle']} label="副标题"><Input.TextArea rows={3} /></Form.Item>
        </Card>
        <Card title="核心优势" style={{ marginTop: 16 }}>
          <Form.List name="advantages">
            {(fields, { add, remove }) => (
              <Space orientation="vertical" style={{ display: 'flex' }}>
                {fields.map((field) => (
                  <div className="advantage-row" key={field.key}>
                    <Form.Item name={[field.name, 'icon']} label="图标"><Input /></Form.Item>
                    <Form.Item name={[field.name, 'title']} label="标题"><Input /></Form.Item>
                    <Form.Item name={[field.name, 'description']} label="描述"><Input /></Form.Item>
                    <Form.Item name={[field.name, 'sortOrder']} label="排序"><InputNumber min={0} /></Form.Item>
                    <Form.Item name={[field.name, 'isEnabled']} label="启用" valuePropName="checked"><Switch /></Form.Item>
                    <Button danger onClick={() => remove(field.name)}>删除</Button>
                  </div>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ icon: 'cluster', title: '', description: '', sortOrder: (homePage?.advantages.length ?? 0) + 1, isEnabled: true })}>新增优势</Button>
              </Space>
            )}
          </Form.List>
        </Card>
        <Button icon={<SaveOutlined />} loading={loading} type="primary" htmlType="submit" style={{ marginTop: 16 }}>保存并发布首页</Button>
      </Form>
    </Space>
  )
}

function RecordsTable({ title, type, records, onCreate, onEdit, onDelete }: { title: string; type: MenuKey; records: CmsRecord[]; onCreate: () => void; onEdit: (type: MenuKey, record: CmsRecord) => void; onDelete: (type: MenuKey, id: number) => void }) {
  return (
    <Card title={title} extra={<Button icon={<PlusOutlined />} type="primary" onClick={onCreate}>新增</Button>}>
      <Table
        rowKey="id"
        dataSource={records}
        pagination={{ pageSize: 8 }}
        columns={[
          { title: '标题', dataIndex: type === 'solutions' ? 'industry' : type === 'products' ? 'name' : 'title' },
          { title: '排序', dataIndex: 'sortOrder', width: 80 },
          { title: '状态', width: 120, render: (_, record) => <Tag color={record.isEnabled ?? record.isPublished ? 'green' : 'default'}>{record.isEnabled ?? record.isPublished ? '已发布' : '停用'}</Tag> },
          { title: '操作', width: 160, render: (_, record) => <Space><Button size="small" onClick={() => onEdit(type, record)}>编辑</Button><Button danger size="small" onClick={() => record.id && onDelete(type, record.id)}>删除</Button></Space> },
        ]}
      />
    </Card>
  )
}

function UsersTable({ users, canCreate, onCreate }: { users: CmsRecord[]; canCreate: boolean; onCreate: () => void }) {
  return (
    <Card title="用户管理" extra={canCreate ? <Button icon={<PlusOutlined />} type="primary" onClick={onCreate}>创建用户</Button> : null}>
      <Table
        rowKey="id"
        dataSource={users}
        columns={[
          { title: '用户名', dataIndex: 'username' },
          { title: '显示名称', dataIndex: 'displayName' },
          { title: '角色', dataIndex: 'role' },
          { title: '状态', render: (_, record) => <Tag color={record.isActive ? 'green' : 'default'}>{record.isActive ? '启用' : '停用'}</Tag> },
        ]}
      />
    </Card>
  )
}

function ProductFields() {
  return (
    <>
      <Form.Item name="name" label="产品名称" rules={[{ required: true }]}><Input /></Form.Item>
      <CommonContentFields enabledName="isEnabled" />
    </>
  )
}

function SolutionFields() {
  return (
    <>
      <Form.Item name="industry" label="行业名称" rules={[{ required: true }]}><Input /></Form.Item>
      <CommonContentFields enabledName="isEnabled" />
    </>
  )
}

function ArticleFields() {
  return (
    <>
      <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="category" label="分类" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="summary" label="摘要"><Input.TextArea rows={2} /></Form.Item>
      <Form.Item name="coverImage" label="封面图 URL"><Input /></Form.Item>
      <Form.Item name="body" label="正文"><Input.TextArea rows={5} /></Form.Item>
      <Form.Item name="publishedAt" label="发布时间 ISO"><Input placeholder="2026-05-07T10:00:00.000Z" /></Form.Item>
      <Form.Item name="sortOrder" label="排序"><InputNumber min={0} /></Form.Item>
      <Form.Item name="isPublished" label="发布" valuePropName="checked"><Switch /></Form.Item>
    </>
  )
}

function CommonContentFields({ enabledName }: { enabledName: string }) {
  return (
    <>
      <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
      <Form.Item name="coverImage" label="封面图 URL"><Input /></Form.Item>
      <Form.Item name="href" label="链接"><Input /></Form.Item>
      <Form.Item name="sortOrder" label="排序"><InputNumber min={0} /></Form.Item>
      <Form.Item name={enabledName} label="启用" valuePropName="checked"><Switch /></Form.Item>
    </>
  )
}

function endpointFor(type: MenuKey) {
  if (type === 'products') return '/admin/products'
  if (type === 'solutions') return '/admin/solutions'
  if (type === 'articles') return '/admin/articles'
  return '/admin/products'
}

function defaultRecord(type: MenuKey) {
  if (type === 'articles') {
    return { title: '', category: '文章', summary: '', coverImage: '', body: '', isPublished: true, publishedAt: new Date().toISOString(), sortOrder: 1 }
  }
  if (type === 'solutions') {
    return { industry: '', description: '', coverImage: '', href: '#', sortOrder: 1, isEnabled: true }
  }
  return { name: '', description: '', coverImage: '', href: '#', sortOrder: 1, isEnabled: true }
}

export default App
