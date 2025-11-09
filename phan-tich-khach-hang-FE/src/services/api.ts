import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface SegmentDTO {
  segmentId: number;
  segmentName: string;
  description: string;
  customerCount: number;
  avgIncome: number;
  avgSpending: number;
  avgMntWines?: number;
  avgNumWebPurchases?: number;
  responseRate: number;
  characteristics?: Record<string, any>;
}

export interface InsightDTO {
  segmentId: number;
  segmentName?: string;
  strategy: string;
  characteristics: string;
  recommendations: string[];
  keyMetrics?: Record<string, number>;
}

export interface DashboardDTO {
  totalCustomers: number;
  avgSpending: number;
  marketingResponseRate: number;
  segmentDistribution: Record<number, number>;
  incomeBySegment: Record<string, Record<number, number>>;
  educationBySegment: Record<string, Record<number, number>>;
  maritalStatusBySegment: Record<string, Record<number, number>>;
  topSegments: SegmentDTO[];
}

// Mock data
const mockSegments: SegmentDTO[] = [
  {
    segmentId: 0,
    segmentName: "Nhóm Tiết kiệm",
    description: "Khách hàng có thu nhập và chi tiêu thấp, ít tham gia các chương trình marketing",
    customerCount: 245,
    avgIncome: 38500,
    avgSpending: 285,
    avgMntWines: 45,
    avgNumWebPurchases: 2.3,
    responseRate: 8.2,
  },
  {
    segmentId: 1,
    segmentName: "Nhóm Trung lưu",
    description: "Khách hàng có thu nhập và chi tiêu trung bình, phản hồi tốt với các chiến dịch marketing",
    customerCount: 512,
    avgIncome: 52000,
    avgSpending: 650,
    avgMntWines: 180,
    avgNumWebPurchases: 4.5,
    responseRate: 15.4,
  },
  {
    segmentId: 2,
    segmentName: "Nhóm Cao cấp",
    description: "Khách hàng có thu nhập cao, chi tiêu nhiều cho sản phẩm cao cấp",
    customerCount: 189,
    avgIncome: 78000,
    avgSpending: 1450,
    avgMntWines: 520,
    avgNumWebPurchases: 6.8,
    responseRate: 22.5,
  },
  {
    segmentId: 3,
    segmentName: "Nhóm VIP",
    description: "Khách hàng cao cấp nhất với thu nhập và chi tiêu rất cao",
    customerCount: 98,
    avgIncome: 95000,
    avgSpending: 2100,
    avgMntWines: 780,
    avgNumWebPurchases: 8.2,
    responseRate: 28.7,
  },
  {
    segmentId: 4,
    segmentName: "Nhóm Tiềm năng",
    description: "Khách hàng trẻ có thu nhập tốt nhưng chi tiêu thận trọng, có tiềm năng phát triển",
    customerCount: 356,
    avgIncome: 48000,
    avgSpending: 420,
    avgMntWines: 95,
    avgNumWebPurchases: 5.1,
    responseRate: 12.8,
  },
];

const mockInsights: InsightDTO[] = [
  {
    segmentId: 0,
    segmentName: "Nhóm Tiết kiệm",
    strategy: "Giá trị & Ưu đãi",
    characteristics: "Thu nhập thấp, ít chi tiêu, nhạy cảm với giá",
    recommendations: [
      "Tập trung vào các chương trình khuyến mãi và giảm giá",
      "Cung cấp gói sản phẩm giá rẻ với số lượng nhỏ",
      "Email marketing với thông tin ưu đãi hấp dẫn",
      "Xây dựng chương trình tích điểm để tăng lòng trung thành",
    ],
    keyMetrics: {
      "Chi tiêu TB": 285,
      "Phản hồi (%)": 8.2,
      "Số KH": 245,
    },
  },
  {
    segmentId: 1,
    segmentName: "Nhóm Trung lưu",
    strategy: "Cân bằng Giá trị",
    characteristics: "Thu nhập trung bình, chi tiêu ổn định, phản hồi tốt",
    recommendations: [
      "Cung cấp gói combo sản phẩm với giá hợp lý",
      "Marketing đa kênh: email, social media, web",
      "Chương trình khách hàng thân thiết với ưu đãi độc quyền",
      "Cross-selling các sản phẩm bổ sung",
      "Tạo nội dung giáo dục về sản phẩm",
    ],
    keyMetrics: {
      "Chi tiêu TB": 650,
      "Phản hồi (%)": 15.4,
      "Số KH": 512,
    },
  },
  {
    segmentId: 2,
    segmentName: "Nhóm Cao cấp",
    strategy: "Chất lượng Premium",
    characteristics: "Thu nhập cao, chi tiêu nhiều, yêu thích sản phẩm cao cấp",
    recommendations: [
      "Giới thiệu dòng sản phẩm cao cấp và độc quyền",
      "Cung cấp dịch vụ tư vấn cá nhân hóa",
      "Tổ chức sự kiện VIP và wine tasting",
      "Gửi catalog sản phẩm cao cấp qua email",
      "Chương trình ưu đãi cho đơn hàng lớn",
    ],
    keyMetrics: {
      "Chi tiêu TB": 1450,
      "Phản hồi (%)": 22.5,
      "Số KH": 189,
    },
  },
  {
    segmentId: 3,
    segmentName: "Nhóm VIP",
    strategy: "Độc quyền & Đặc biệt",
    characteristics: "Thu nhập rất cao, chi tiêu lớn, khách hàng VIP",
    recommendations: [
      "Cung cấp sản phẩm limited edition và exclusive",
      "Dịch vụ concierge và giao hàng ưu tiên",
      "Mời tham gia câu lạc bộ VIP với nhiều đặc quyền",
      "Tư vấn riêng từ chuyên gia sommelier",
      "Tặng quà cao cấp vào các dịp đặc biệt",
      "Early access cho các sản phẩm mới",
    ],
    keyMetrics: {
      "Chi tiêu TB": 2100,
      "Phản hồi (%)": 28.7,
      "Số KH": 98,
    },
  },
  {
    segmentId: 4,
    segmentName: "Nhóm Tiềm năng",
    strategy: "Phát triển & Giáo dục",
    characteristics: "Trẻ, thu nhập tốt, chi tiêu thận trọng nhưng có tiềm năng",
    recommendations: [
      "Cung cấp nội dung giáo dục về rượu vang và sản phẩm",
      "Tổ chức workshop và tasting session cho người mới",
      "Gói khuyến mãi dùng thử các sản phẩm khác nhau",
      "Marketing qua social media và influencer",
      "Xây dựng community online cho khách hàng trẻ",
    ],
    keyMetrics: {
      "Chi tiêu TB": 420,
      "Phản hồi (%)": 12.8,
      "Số KH": 356,
    },
  },
];

const mockDashboard: DashboardDTO = {
  totalCustomers: 1400,
  avgSpending: 781,
  marketingResponseRate: 17.5,
  segmentDistribution: {
    0: 245,
    1: 512,
    2: 189,
    3: 98,
    4: 356,
  },
  incomeBySegment: {
    "Low": { 0: 180, 1: 85, 2: 20, 3: 5, 4: 110 },
    "Medium": { 0: 50, 1: 320, 2: 45, 3: 10, 4: 200 },
    "High": { 0: 15, 1: 107, 2: 124, 3: 83, 4: 46 },
  },
  educationBySegment: {
    "Basic": { 0: 120, 1: 150, 2: 30, 3: 10, 4: 90 },
    "Graduate": { 0: 100, 1: 280, 2: 100, 3: 45, 4: 200 },
    "Postgrad": { 0: 25, 1: 82, 2: 59, 3: 43, 4: 66 },
  },
  maritalStatusBySegment: {
    "Single": { 0: 80, 1: 180, 2: 50, 3: 25, 4: 165 },
    "Married": { 0: 130, 1: 260, 2: 110, 3: 60, 4: 150 },
    "Other": { 0: 35, 1: 72, 2: 29, 3: 13, 4: 41 },
  },
  topSegments: mockSegments.slice(1, 4),
};

// API Functions
export const getSegments = async (): Promise<SegmentDTO[]> => {
  try {
    const response = await api.get('/analysis/segments');
    return response.data;
  } catch (error) {
    console.error('Error fetching segments:', error);
    return mockSegments; // Fallback to mock data
  }
};

export const getInsights = async (): Promise<InsightDTO[]> => {
  try {
    const response = await api.get('/analysis/insights');
    return response.data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    return mockInsights; // Fallback to mock data
  }
};

export const getDashboard = async (): Promise<DashboardDTO> => {
  try {
    const response = await api.get('/analysis/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return mockDashboard; // Fallback to mock data
  }
};

// Upload related interfaces
export interface UploadResponse {
  success: boolean;
  message: string;
  fileName: string;
  rowCount: number;
  preview: any[];
  parquetPath?: string;
}

export interface ClusterRequest {
  filePath: string;
  numClusters: number;
}

export interface ClusterResponse {
  success: boolean;
  message: string;
  clustersCreated: number;
}

// Customer interfaces
export interface CustomerDTO {
  id: number;
  education: string;
  maritalStatus: string;
  income: number;
  segment: number;
}

// Get all customers with optional filters
export const getCustomers = async (segment?: number, maritalStatus?: string): Promise<CustomerDTO[]> => {
  try {
    const params: any = {};
    if (segment !== undefined) params.segment = segment;
    if (maritalStatus) params.maritalStatus = maritalStatus;
    
    const response = await api.get('/analysis/customers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Get customer by ID
export const getCustomerById = async (id: number): Promise<CustomerDTO | null> => {
  try {
    const response = await api.get(`/analysis/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

// Login
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken, userId } = response.data.data;
    
    // Store token
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', userId.toString());
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  }
};

// Refresh token
export const refreshToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refreshtoken', { refreshToken });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    return accessToken;
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    throw new Error(error.response?.data?.message || 'Failed to refresh token');
  }
};

export default api;

// Upload file
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/analysis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      success: true,
      message: response.data.message || "File uploaded successfully",
      fileName: response.data.fileName || file.name,
      rowCount: response.data.rowCount || 0,
      preview: response.data.preview || [],
      parquetPath: response.data.parquetPath,
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload file');
  }
};

// Cluster data
export const clusterData = async (request: ClusterRequest): Promise<ClusterResponse> => {
  try {
    const response = await api.post('/analysis/cluster', null, {
      params: {
        parquetPath: request.filePath,
      },
    });
    
    return {
      success: true,
      message: response.data || "Clustering completed successfully",
      clustersCreated: request.numClusters,
    };
  } catch (error: any) {
    console.error('Error clustering data:', error);
    throw new Error(error.response?.data?.message || 'Failed to cluster data');
  }
};
