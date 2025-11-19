import React, { useState } from 'react';
import { Form, Upload, Button, message, Space, Card, Typography, Alert, Steps, Divider } from 'antd';
import { UploadOutlined, DownloadOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;
const { Step } = Steps;

// URL API thực tế của bạn
const API_URL = 'http://localhost:8000/api/admin/api/ProviderImport/new-dataset';

// ⚠️ CẦN CẬP NHẬT: Thay thế bằng URL thực tế nơi bạn lưu trữ các tệp mẫu
const METADATA_SAMPLE_URL = '/templates/metadata_sample.xlsx'; 
const DATA_SAMPLE_URL = '/templates/data_sample.csv';

/**
 * Component cho phép nhà cung cấp tải lên các tệp sản phẩm, 
 * sử dụng Ant Design, FormData và Authentication Token.
 */
const ProductUploader = () => {
    const [metadataFile, setMetadataFile] = useState(null);
    const [dataFile, setDataFile] = useState(null);
    const [loading, setLoading] = useState(false);

    /**
     * Lấy token xác thực từ Local Storage, định dạng thành "Bearer <token>".
     * @returns {string | null} Auth token hoặc null nếu không tìm thấy.
     */
    const getAuthToken = () => {
        const token = localStorage.getItem('authToken');
        return token ? `Bearer ${token}` : null;
    };

    /**
     * Xử lý việc gửi tệp và token đến API.
     */
    const handleSubmit = async () => {
        // 1. Kiểm tra File
        if (!metadataFile || !dataFile) {
            message.error('Vui lòng chọn cả hai tệp Metadata và Data trước khi gửi.');
            return;
        }

        // 2. Lấy Token
        const authToken = getAuthToken();
        if (!authToken) {
            message.error('Lỗi: Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
            return;
        }

        setLoading(true);

        // 3. Chuẩn bị FormData (multipart/form-data)
        const formData = new FormData();
        // Tên trường phải khớp chính xác với API: MetadataFile và DataFile
        formData.append('MetadataFile', metadataFile);
        formData.append('DataFile', dataFile);

        try {
            // 4. Gửi yêu cầu Fetch
            const response = await fetch(API_URL, {
                method: 'POST',
                // Content-Type được trình duyệt tự động đặt cho FormData
                headers: {
                    'Authorization': authToken, // Gửi Token
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                message.success('Tải lên thành công! ' + (result.message || 'Dữ liệu đã được nhập.'));
                // Reset form sau khi thành công
                setMetadataFile(null);
                setDataFile(null);
            } else {
                const errorText = await response.text();
                // Hiển thị thông báo lỗi chi tiết hơn
                message.error(`Tải lên thất bại. Mã lỗi: ${response.status}. Chi tiết: ${errorText.substring(0, 100)}...`);
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            message.error('Lỗi kết nối mạng hoặc lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cấu hình tùy chỉnh cho component Upload của Ant Design.
     * Tắt tải lên mặc định và lưu tệp vào state.
     */
    const uploadProps = (setter) => ({
        // Ngăn Ant Design tự động tải lên
        beforeUpload: (file) => {
            setter(file); // Lưu tệp vào state
            return false; 
        },
        maxCount: 1, 
        onRemove: () => setter(null),
        // Quản lý fileList để hiển thị tệp đã chọn
        fileList: setter === setMetadataFile 
            ? (metadataFile ? [metadataFile] : []) 
            : (dataFile ? [dataFile] : []),
    });

    const currentStep = (!metadataFile || !dataFile) ? 1 : 2;

    return (
        <Card 
            style={{ maxWidth: 800, margin: '50px auto' }} 
            title={<Title level={2}>🌟 Cổng Tải lên Dữ liệu Sản phẩm</Title>}
        >
            <Alert
                message="Hướng dẫn Định dạng Tệp"
                description="Vui lòng **tải xuống và sử dụng chính xác cấu trúc** của các tệp mẫu để tránh lỗi nhập dữ liệu."
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
            />

            <Steps 
                current={currentStep} 
                status={loading ? "process" : "wait"}
                style={{ marginBottom: 30 }}
            >
                <Step title="Tải Mẫu" icon={<DownloadOutlined />} />
                <Step title="Chọn Tệp" icon={<UploadOutlined />} />
                <Step title="Gửi Dữ liệu" icon={<CheckCircleOutlined />} />
            </Steps>
            
            <Divider orientation="left">### Bước 1: Tải về Tệp Mẫu</Divider>

            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card type="inner" title="Metadata (.xlsx)">
                    <Text>Cấu trúc: Tên sản phẩm, mô tả, đơn vị, v.v. (Ví dụ: `dataupload.xlsx`)</Text>
                    <Link href={METADATA_SAMPLE_URL} target="_blank" style={{ marginLeft: 16 }}>
                        <Button icon={<DownloadOutlined />} type="dashed" size="small">
                            Tải Tệp Metadata Mẫu
                        </Button>
                    </Link>
                </Card>
                <Card type="inner" title="Dữ liệu Thô (.csv)">
                    <Text>Cấu trúc: Các trường dữ liệu thô, liên kết với Metadata. (Ví dụ: `rawdataupload.csv`)</Text>
                    <Link href={DATA_SAMPLE_URL} target="_blank" style={{ marginLeft: 16 }}>
                        <Button icon={<DownloadOutlined />} type="dashed" size="small">
                            Tải Tệp Data Thô Mẫu
                        </Button>
                    </Link>
                </Card>
            </Space>

            <Divider orientation="left">### Bước 2 & 3: Tải lên và Gửi</Divider>

            <Form 
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Trường MetadataFile */}
                <Form.Item
                    label="Tải lên Tệp Metadata (Đã điền)"
                    required
                    validateStatus={metadataFile ? 'success' : 'error'}
                    help={metadataFile ? `✅ Đã chọn: ${metadataFile.name}` : 'Vui lòng chọn tệp .xlsx.'}
                >
                    <Upload
                        {...uploadProps(setMetadataFile)}
                        accept=".xlsx"
                    >
                        <Button icon={<UploadOutlined />} disabled={loading}>
                            Chọn Tệp Metadata (.xlsx)
                        </Button>
                    </Upload>
                </Form.Item>

                {/* Trường DataFile */}
                <Form.Item
                    label="Tải lên Tệp Dữ liệu Thô (Đã điền)"
                    required
                    validateStatus={dataFile ? 'success' : 'error'}
                    help={dataFile ? `✅ Đã chọn: ${dataFile.name}` : 'Vui lòng chọn tệp .csv.'}
                >
                    <Upload
                        {...uploadProps(setDataFile)}
                        accept=".csv"
                    >
                        <Button icon={<UploadOutlined />} disabled={loading}>
                            Chọn Tệp Dữ liệu Thô (.csv)
                        </Button>
                    </Upload>
                </Form.Item>

                {/* Nút Gửi */}
                <Form.Item style={{ marginTop: 30 }}>
                    <Button 
                        type="primary" 
                        size="large"
                        onClick={handleSubmit} 
                        loading={loading}
                        disabled={loading || !metadataFile || !dataFile}
                        block
                    >
                        {loading ? 'Đang Gửi Dữ Liệu...' : 'Gửi Dữ liệu Sản phẩm Ngay'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProductUploader;