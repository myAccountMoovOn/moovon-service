import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Typography, 
  DatePicker, 
  Space, 
  Button,
  Tabs,
  Tag,
  App,
  Grid,
  Drawer,
  Flex,
  Avatar, 
  Divider, 
  Empty,
  Alert
} from 'antd';
import { 
  DownloadOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined,
  FileTextOutlined,
  TeamOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined,
  CalendarOutlined,
  HistoryOutlined,
  UserOutlined,
  RocketOutlined,
  DollarOutlined,
  FilterOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useRevenue, useRenewals } from '../../hooks/useApi';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const Reports: React.FC = () => {
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [activeTab, setActiveTab] = useState('revenue');
  const [detailedData, setDetailedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Detail Drawer State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const from = dateRange[0].format('YYYY-MM-DD');
  const to = dateRange[1].format('YYYY-MM-DD');

  const { data: revenueData, isLoading: revLoading } = useRevenue(from, to);
  const { data: renewalsData, isLoading: renLoading } = useRenewals(from, to);

  const fetchDetailedReport = async (tabKey: string) => {
    if (tabKey === 'revenue' || tabKey === 'renewals') return;
    
    setLoading(true);
    try {
      let endpoint = '';
      if (tabKey === 'customers') endpoint = '/reports/customers-detailed';
      if (tabKey === 'services') endpoint = '/reports/services-detailed';
      if (tabKey === 'payment_status') endpoint = '/reports/payment-status-detailed';

      if (endpoint) {
        const response = await axiosInstance.get(endpoint);
        // Our API returns { success: boolean, data: any, message: string }
        const result = response.data?.data || [];
        setDetailedData(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      message.error('Failed to load detailed report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedReport(activeTab);
  }, [activeTab]);

  const handleExport = async (format: 'pdf' | 'xlsx' | 'csv', type: string) => {
    try {
      const endpoint = format === 'pdf' 
        ? `/reports/export/pdf/${type}` 
        : `/reports/export/${format}/${type}`;
        
      const response = await axiosInstance.get(endpoint, {
        params: { from, to },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_${dayjs().format('YYYYMMDD')}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success(`${format.toUpperCase()} Exported successfully`);
    } catch (err) {
      message.error(`Failed to export ${format.toUpperCase()}`);
    }
  };

  const openDetails = (item: any) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  // --- Column Definitions ---

  const customerColumns = [
    { title: 'Customer', dataIndex: 'name', key: 'name', render: (n: string) => <Text strong>{n}</Text> },
    { title: 'Contact', dataIndex: 'email', key: 'email', responsive: ['md' as const] },
    { title: 'Subs', dataIndex: 'subscriptionsCount', render: (c: number) => <Tag color="blue">{c}</Tag> },
    { title: 'Status', dataIndex: 'isActive', render: (a: boolean) => <Tag color={a ? 'green' : 'red'}>{a ? 'ACTIVE' : 'INACTIVE'}</Tag> },
  ];

  const serviceColumns = [
    { title: 'Service', dataIndex: 'name', key: 'name', render: (n: string) => <Text strong>{n}</Text> },
    { title: 'Activity', dataIndex: 'subscriptionsCount', render: (c: number) => <Tag color="purple">{c} Active</Tag> },
    { title: 'Price', dataIndex: 'monthlyPrice', render: (p: number) => `₹${p}/mo`, responsive: ['md' as const] },
  ];

  const paymentColumns = [
    { title: 'Customer', dataIndex: ['customer', 'name'] },
    { title: 'Due Date', dataIndex: 'endDate', render: (d: string) => dayjs(d).format('DD MMM YYYY') },
    { title: 'Amount', dataIndex: 'amount', render: (a: number) => <Text strong>₹{a}</Text> },
    { title: 'Status', dataIndex: 'paymentStatus', render: (s: string) => <Tag color="warning">{(s || 'PENDING').toUpperCase()}</Tag> },
  ];

  const revenueColumns = [
    { title: 'TX ID', dataIndex: 'transactionId', render: (id: string) => <Text type="secondary" style={{ fontSize: '11px' }}>{id || 'MANUAL'}</Text> },
    { title: 'Customer', dataIndex: ['subscription', 'customer', 'name'] },
    { title: 'Amount', dataIndex: 'amount', render: (a: number) => <Text strong>₹{a}</Text> },
    { title: 'Date', dataIndex: 'paidAt', render: (d: string) => dayjs(d).format('DD MMM') },
  ];

  const renewalColumns = [
    { title: 'Customer', dataIndex: ['customer', 'name'] },
    { title: 'Service', dataIndex: ['service', 'name'] },
    { title: 'Expiry', dataIndex: 'endDate', render: (d: string) => dayjs(d).format('DD MMM YYYY') },
    { title: 'Amount', dataIndex: 'amount', render: (a: number) => `₹{a}` },
  ];

  // --- Render Helpers ---

  const renderExportBar = (type: string) => (
    <Card styles={{ body: { padding: '12px 16px' } }} style={{ marginBottom: 16, borderRadius: '12px', background: '#f8f9fa' }}>
        <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
            <Text type="secondary"><DownloadOutlined /> EXPORT OPTIONS:</Text>
            <Flex gap={8}>
                <Button icon={<FileExcelOutlined />} onClick={() => handleExport('xlsx', type)} size="small">Excel</Button>
                <Button icon={<FileTextOutlined />} onClick={() => handleExport('csv', type)} size="small">CSV</Button>
                <Button icon={<FilePdfOutlined />} onClick={() => handleExport('pdf', type)} size="small" danger>PDF</Button>
            </Flex>
        </Flex>
    </Card>
  );

  const renderAdaptiveTable = (columns: any[], dataSource: any, type: string, mobileRenderer: (item: any) => React.ReactNode) => {
    const safeData = Array.isArray(dataSource) ? dataSource : [];
    
    return (
      <div style={{ marginTop: 16 }}>
        {renderExportBar(type)}
        {!isMobile ? (
          <Table columns={columns} dataSource={safeData} loading={loading || revLoading || renLoading} rowKey="id" className="card-shadow" style={{ borderRadius: '12px', overflow: 'hidden' }} />
        ) : (
          <div style={{ marginTop: 8 }}>
            {safeData.map((item, index) => (
               <div 
                key={item.id || index}
                onClick={() => openDetails(item)}
                style={{ background: 'white', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid #f0f0f0' }}
                className="card-shadow-sm"
              >
                {mobileRenderer(item)}
              </div>
            ))}
            {safeData.length === 0 && !loading && !revLoading && !renLoading && (
              <Empty description="No data for selected period" />
            )}
          </div>
        )}
      </div>
    );
  };

  const tabItems = [
    {
      key: 'revenue',
      label: <span><LineChartOutlined />Revenue</span>,
      children: renderAdaptiveTable(revenueColumns, revenueData?.payments || [], 'revenue', (item) => (
        <Flex justify="space-between" align="center">
          <Flex vertical gap={0}>
              <Text strong>{(item as any).subscription?.customer?.name}</Text>
              <Text type="secondary" style={{ fontSize: '11px' }}>{dayjs(item.paidAt).format('MMM D, YYYY')}</Text>
          </Flex>
          <Text strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>₹{(item.amount || 0).toLocaleString()}</Text>
        </Flex>
      ))
    },
    {
      key: 'renewals',
      label: <span><HistoryOutlined />Renewals</span>,
      children: renderAdaptiveTable(renewalColumns, renewalsData || [], 'renewals', (item) => (
        <Flex justify="space-between" align="center">
          <Flex vertical gap={0}>
              <Text strong>{(item as any).customer?.name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{(item as any).service?.name}</Text>
          </Flex>
          <Flex vertical align="end" gap={0}>
              <Text type="secondary" style={{ fontSize: '10px' }}>EXPIRY</Text>
              <Text strong style={{ color: dayjs(item.endDate).isBefore(dayjs()) ? '#ff4d4f' : 'inherit' }}>{dayjs(item.endDate).format('DD MMM')}</Text>
          </Flex>
        </Flex>
      ))
    },
    {
      key: 'customers',
      label: <span><TeamOutlined />Customers</span>,
      children: renderAdaptiveTable(customerColumns, detailedData, 'customers', (item) => (
        <Flex justify="space-between" align="center">
          <Flex vertical gap={0}>
              <Text strong>{item.name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{item.email}</Text>
          </Flex>
          <Tag color="blue">{item.subscriptionsCount} SUBS</Tag>
        </Flex>
      ))
    },
    {
      key: 'services',
      label: <span><AppstoreOutlined />Services</span>,
      children: renderAdaptiveTable(serviceColumns, detailedData, 'services', (item) => (
        <Flex justify="space-between" align="center">
          <Text strong style={{ fontSize: '15px' }}>{item.name}</Text>
          <Tag color="purple">{item.subscriptionsCount} USERS</Tag>
        </Flex>
      ))
    },
    {
      key: 'payment_status',
      label: <span><ExclamationCircleOutlined />Collections</span>,
      children: renderAdaptiveTable(paymentColumns, detailedData, 'payment_status', (item) => (
        <Flex justify="space-between" align="center">
          <Flex vertical gap={0}>
              <Text strong>{(item as any).customer?.name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{(item as any).service?.name}</Text>
          </Flex>
          <Tag color="warning">{(item.paymentStatus || 'PENDING').toUpperCase()}</Tag>
        </Flex>
      ))
    }
  ];

  return (
    <div style={{ padding: isMobile ? 0 : '0 8px' }}>
      <Flex vertical={isMobile} justify="space-between" align={isMobile ? 'stretch' : 'center'} style={{ marginBottom: 24, gap: 16 }}>
        <div>
            <Title level={2} style={{ margin: 0 }}>Reports & Analytics</Title>
            <Text type="secondary">Data-driven insights and financial auditing</Text>
        </div>
        <div style={{ background: 'white', padding: '8px 12px', borderRadius: '12px' }} className="card-shadow-sm">
            <Flex align="center" gap={12}>
                <FilterOutlined style={{ color: 'var(--color-primary)' }} />
                <Flex gap={8} style={{ width: isMobile ? '100%' : 'auto' }}>
                  <DatePicker 
                    placeholder="From"
                    value={dateRange[0]}
                    onChange={(d) => d && setDateRange([d, dateRange[1]])}
                    style={{ flex: 1, border: 'none', boxShadow: 'none' }}
                    size="middle"
                  />
                  <Text type="secondary" style={{ padding: '0 4px', alignSelf: 'center' }}>→</Text>
                  <DatePicker 
                    placeholder="To"
                    value={dateRange[1]}
                    onChange={(d) => d && setDateRange([dateRange[0], d])}
                    style={{ flex: 1, border: 'none', boxShadow: 'none' }}
                    size="middle"
                  />
                </Flex>
            </Flex>
        </div>
      </Flex>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabItems} 
        type="card"
        className="card-shadow-soft"
        style={{ borderRadius: '16px' }}
      />

      {/* Detail Drawer (Mobile) */}
      <Drawer
        title={<Text strong style={{ fontSize: '18px' }}>Report Analysis</Text>}
        placement="bottom"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '24px', height: '80vh' }, header: { borderBottom: '1px solid #f0f0f0' } }}
      >
        {selectedItem && (
            <Flex vertical gap={24}>
                <Flex align="center" gap={16}>
                    <Avatar size={64} style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }} icon={<LineChartOutlined />} />
                    <div>
                        <Title level={4} style={{ margin: 0 }}>Detail Audit View</Title>
                        <Text type="secondary">Comprehensive data breakdown for auditing</Text>
                    </div>
                </Flex>

                <Divider style={{ margin: 0 }} />

                <Card styles={{ body: { padding: '20px' } }} style={{ borderRadius: '16px', background: '#f9fbff', border: 'none' }}>
                    <Flex vertical gap={12}>
                        {Object.entries(selectedItem).map(([key, value]) => {
                            if (typeof value === 'object' || key === 'id') return null;
                            return (
                                <div key={key}>
                                    <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{key.replace(/([A-Z])/g, ' $1')}</Text>
                                    <Text strong style={{ display: 'block', fontSize: '15px' }}>{String(value)}</Text>
                                </div>
                            );
                        })}
                    </Flex>
                </Card>

                <Alert
                   title="Actionable Intelligence"
                   description="This summary provides a historical snapshot. Use the Export features to generate formal documentation for tax or audit purposes."
                   type="info"
                   showIcon
                   style={{ borderRadius: '12px' }}
                />

                <Button type="primary" size="large" block onClick={() => setIsDrawerOpen(false)} style={{ height: '54px', borderRadius: '12px' }}>
                    Close Analysis
                </Button>
            </Flex>
        )}
      </Drawer>
    </div>
  );
};

export default Reports;
