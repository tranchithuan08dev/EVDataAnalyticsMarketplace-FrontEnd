import { Table, Tag, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


const data = [
  { id: 1, title: "Hành vi lái xe #12", type: "Hành vi", status: "Đã duyệt", price: "850K" },
  { id: 2, title: "Pin VF8", type: "Pin", status: "Chờ duyệt", price: "1.2M" },
];

const columns = [
  { title: 'Tên', dataIndex: 'title' },
  { title: 'Loại', dataIndex: 'type', render: t => <Tag>{t}</Tag> },
  { title: 'Giá', dataIndex: 'price' },
  { title: 'Trạng thái', dataIndex: 'status', render: s => <Tag color={s.includes('Chờ') ? 'orange' : 'green'}>{s}</Tag> },
  {
    title: '',
    render: () => (
      <Space>
        <Button size="small" icon={<EditOutlined />} />
        <Popconfirm title="Xóa dataset?" okText="Xóa">
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )
  },
];

export default function DatasetManager() {
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h2 className="fw-bold">Quản lý Dataset</h2>
        <Button type="primary">Thêm mới</Button>
      </div>
      <Table dataSource={data} columns={columns} />
    </>
  );
}