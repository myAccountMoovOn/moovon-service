import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, Progress, List, Badge, Alert } from 'antd';
import {
  TeamOutlined, DollarOutlined, RiseOutlined, PlusOutlined, CrownOutlined,
  CheckCircleOutlined, SyncOutlined, WarningOutlined, CalendarOutlined,
  AlertOutlined, ClockCircleOutlined, ArrowUpOutlined, FallOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ResellerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const recentClients = [
    { key: '1', name: 'Acme Corp',       plan: 'Gold',     joined: '2026-09-01', status: 'Active',    amount: '₹49,900/mo' },
    { key: '2', name: 'Globex Inc',      plan: 'Silver',   joined: '2026-08-25', status: 'Active',    amount: '₹19,900/mo' },
    { key: '3', name: 'Initech',         plan: 'Starter',  joined: '2026-08-10', status: 'Trial',     amount: '₹4,900/mo'  },
    { key: '4', name: 'Umbrella Corp',   plan: 'Platinum', joined: '2026-08-01', status: 'Active',    amount: '₹99,900/mo' },
    { key: '5', name: 'Massive Dynamic', plan: 'Silver',   joined: '2026-07-28', status: 'Suspended', amount: '₹19,900/mo' },
  ];

  const upcomingRenewals = [
    { key: '1', name: 'Acme Corp',     plan: 'Gold',     date: 'Sep 15, 2026', amount: '₹49,900' },
    { key: '2', name: 'Globex Inc',    plan: 'Silver',   date: 'Sep 18, 2026', amount: '₹19,900' },
    { key: '3', name: 'Nano Corp',     plan: 'Starter',  date: 'Sep 20, 2026', amount: '₹4,900'  },
  ];

  const usageAlerts = [
    { company: 'Globex Inc',    metric: 'Customer slots',  usage: 92, limit: 100, severity: 'high'   },
    { company: 'Acme Corp',     metric: 'Storage',         usage: 78, limit: 100, severity: 'medium' },
    { company: 'Massive Dynamic', metric: 'API Calls',     usage: 85, limit: 100, severity: 'high'   },
  ];

  const clientColumns = [
    { title: 'Client',   dataIndex: 'name',   key: 'name',   render: (t: string) => <strong>{t}</strong> },
    { title: 'Plan',     dataIndex: 'plan',   key: 'plan',   render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: 'Joined',   dataIndex: 'joined', key: 'joined' },
    { title: 'Revenue',  dataIndex: 'amount', key: 'amount', render: (t: string) => <Text strong style={{ color: '#16A34A' }}>{t}</Text> },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const map: Record<string, { color: string; icon?: React.ReactNode }> = {
          Active:    { color: 'green',  icon: <CheckCircleOutlined /> },
          Trial:     { color: 'blue',   icon: <SyncOutlined spin />   },
          Suspended: { color: 'red' },
        };
        const cfg = map[s] || { color: 'default' };
        return <Tag icon={cfg.icon} color={cfg.color}>{s}</Tag>;
      },
    },
    {
      title: 'Action', key: 'action',
      render: () => (
        <Button type="link" size="small" style={{ color: '#16A34A', padding: 0 }}>
          View →
        </Button>
      ),
    },
  ];

  const renewalColumns = [
    { title: 'Company', dataIndex: 'name',   key: 'name',   render: (t: string) => <strong>{t}</strong> },
    { title: 'Plan',    dataIndex: 'plan',   key: 'plan',   render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: 'Date',    dataIndex: 'date',   key: 'date',   render: (t: string) => <><CalendarOutlined style={{ marginRight: 4, color: '#F59E0B' }} />{t}</> },
    { title: 'Amount',  dataIndex: 'amount', key: 'amount', render: (t: string) => <Text strong>{t}</Text> },
  ];

  const kpiCards = [
    {
      title: 'Total B2B Companies',
      value: 24,
      suffix: 'clients',
      prefix: <TeamOutlined />,
      color: '#16A34A',
      trend: '+3 this month',
      trendUp: true,
    },
    {
      title: 'Active Plans',
      value: 21,
      suffix: 'active',
      prefix: <CheckCircleOutlined />,
      color: '#0EA5E9',
      trend: '3 in trial',
      trendUp: true,
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '₹8,45,000',
      prefix: <DollarOutlined />,
      color: '#16A34A',
      trend: '+12% from last month',
      trendUp: true,
    },
    {
      title: 'Renewals This Week',
      value: 3,
      suffix: 'upcoming',
      prefix: <ClockCircleOutlined />,
      color: '#F59E0B',
      trend: '₹74,700 at stake',
      trendUp: null,
    },
    {
      title: 'Commission Earned',
      value: '₹2,53,500',
      prefix: <CrownOutlined />,
      color: '#F59E0B',
      trend: 'Next payout in 5 days',
      trendUp: null,
    },
    {
      title: 'Usage Alerts',
      value: usageAlerts.length,
      suffix: 'alerts',
      prefix: <AlertOutlined />,
      color: '#EF4444',
      trend: `${usageAlerts.filter(a => a.severity === 'high').length} critical`,
      trendUp: false,
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#064E3B', margin: 0 }}>Welcome back, Partner! 👋</Title>
          <Text type="secondary">Here's what's happening with your clients today.</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: 40, fontWeight: 600 }}
          onClick={() => navigate('/companies')}
        >
          Onboard New Client
        </Button>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {kpiCards.map((kpi, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card
              variant="borderless"
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}
              styles={{ body: { padding: '20px 24px' } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{kpi.title}</Text>
                  <div style={{ fontSize: 26, fontWeight: 700, color: kpi.color, marginTop: 4 }}>
                    {kpi.prefix && <span style={{ marginRight: 6, fontSize: 18 }}>{kpi.prefix}</span>}
                    {kpi.value}
                    {kpi.suffix && <span style={{ fontSize: 14, fontWeight: 400, color: '#6B7280', marginLeft: 4 }}>{kpi.suffix}</span>}
                  </div>
                </div>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 10,
                    backgroundColor: `${kpi.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: kpi.color,
                  }}
                >
                  {kpi.prefix}
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12 }}>
                {kpi.trendUp === true  && <Text type="success"><ArrowUpOutlined /> {kpi.trend}</Text>}
                {kpi.trendUp === false && <Text type="danger"><FallOutlined /> {kpi.trend}</Text>}
                {kpi.trendUp === null  && <Text type="secondary">{kpi.trend}</Text>}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Usage Alerts Banner */}
      {usageAlerts.some(a => a.severity === 'high') && (
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 20, borderRadius: 10 }}
          title={
            <span>
              <strong>{usageAlerts.filter(a => a.severity === 'high').length} clients</strong> are approaching their plan limits.{' '}
              <Button type="link" style={{ padding: 0, color: '#D97706' }} onClick={() => navigate('/companies')}>
                Review now →
              </Button>
            </span>
          }
        />
      )}

      <Row gutter={[16, 16]}>
        {/* Recent Clients Table */}
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontWeight: 700 }}>Recent Client Onboarding</span>}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 16 }}
            extra={<Button type="link" style={{ color: '#16A34A' }} onClick={() => navigate('/companies')}>View all →</Button>}
          >
            <Table dataSource={recentClients} columns={clientColumns} pagination={false} size="middle" />
          </Card>

          {/* Renewals */}
          <Card
            title={<span style={{ fontWeight: 700 }}>⏰ Upcoming Renewals</span>}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            extra={<Button type="link" style={{ color: '#16A34A' }} onClick={() => navigate('/tenant-billing')}>View billing →</Button>}
          >
            <Table dataSource={upcomingRenewals} columns={renewalColumns} pagination={false} size="middle" />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Partner Tier */}
          <Card
            title={<span style={{ fontWeight: 700 }}>Partner Tier Status</span>}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 16 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <CrownOutlined style={{ fontSize: 48, color: '#F59E0B' }} />
              <Title level={4} style={{ margin: '8px 0 0 0' }}>Gold Partner</Title>
              <Text type="secondary">30% Commission Rate</Text>
            </div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <Text>Progress to Platinum</Text>
              <Text strong>24/50 Clients</Text>
            </div>
            <Progress percent={48} status="active" strokeColor="#16A34A" />
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              26 more clients to unlock Platinum (35% commission)
            </Text>
          </Card>

          {/* Usage Alerts */}
          <Card
            title={
              <span style={{ fontWeight: 700 }}>
                ⚠️ Usage Alerts{' '}
                <Badge count={usageAlerts.length} style={{ backgroundColor: '#EF4444', marginLeft: 4 }} />
              </span>
            }
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 16 }}
          >
            <List
              dataSource={usageAlerts}
              renderItem={(item) => (
                <List.Item style={{ padding: '10px 0' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 13 }}>{item.company}</Text>
                      <Tag color={item.severity === 'high' ? 'red' : 'orange'} style={{ fontSize: 11 }}>
                        {item.usage}%
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.metric}</Text>
                    <Progress
                      percent={item.usage}
                      size="small"
                      strokeColor={item.severity === 'high' ? '#EF4444' : '#F59E0B'}
                      showInfo={false}
                      style={{ marginTop: 4 }}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Quick Actions */}
          <Card
            title={<span style={{ fontWeight: 700 }}>Quick Actions</span>}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <List itemLayout="horizontal">
              {[
                { label: 'Provision New Company',    desc: 'Create a new B2B tenant account',     path: '/companies'       },
                { label: 'Create Custom Plan',       desc: 'Build a new Silver / Gold plan',      path: '/plan-builder'    },
                { label: 'Configure Branding',       desc: 'Update logo, colors & custom domain', path: '/white-label'     },
                { label: 'View Commission Payouts',  desc: 'Check your billing history',          path: '/reports'         },
              ].map((item) => (
                <List.Item key={item.path} style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    title={
                      <a
                        style={{ color: '#16A34A', fontWeight: 600, fontSize: 13 }}
                        onClick={() => navigate(item.path)}
                      >
                        {item.label}
                      </a>
                    }
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>}
                  />
                </List.Item>
              ))}
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResellerDashboard;
