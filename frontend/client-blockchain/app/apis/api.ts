// api/fileApi.ts
import { AccountData } from '../definations/account';
import { MonthYearRangeQueryDto, ResponseResourceUsageDto } from '../definations/report-details';
import axiosClient from '../utils/axios-client';

export const login = async (username: string, password: string): Promise<string> => {
  try {
    const response = await axiosClient.post<{ token: string, message?: string }>(
      '/auth/login', { username, password }
    );

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    if (!response.data.token) {
      alert(`${response.data.message || 'No token received'}!`);
      throw new Error('Invalid token received');
    }

    return response.data.token;

  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed');
  }
};

export const createAccount = async (accountData: AccountData): Promise<string> => {
  try {
    const response = await axiosClient.post<{ message: string }>('/users', accountData);

    console.log('Account creation response:', response);

    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    return response.data.message || 'Tạo tài khoản thành công!';

  } catch (error) {
    console.error('Account creation failed:', error);
    alert('Tạo tài khoản thất bại. Vui lòng kiểm tra lại!');
    throw new Error('Account creation failed');
  }
};

//#region backend API 
// @Post('yearly-usage')
// getYearlyUsage(@Body() dataTime?: MonthYearRangeQueryDto) {
//   return this.resourceUsageService.getYearlyUsage(dataTime || {});
// }
//#region

/**
 * Lấy danh sách báo cáo năng lượng sử dụng, có thể lọc theo tháng/năm
 * @param monthYearRange 
 * @returns 
 */
export const getYearlyUsage = async (
  monthYearRange?: MonthYearRangeQueryDto): Promise<ResponseResourceUsageDto[]> => {
  try {
    const response = await axiosClient.post<ResponseResourceUsageDto[]>('/resource-usage/yearly-usage', monthYearRange);
    return response.data;

  } catch (error) {
    console.error('Failed to fetch yearly usage:', error);
    throw new Error('Failed to fetch yearly usage');
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await axiosClient.post<{ message: string }>(
      '/users/change-password', { oldPassword, newPassword }
    );

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;

  } catch (error) {
    console.error('Change password failed:', error);
    throw new Error('Change password failed');
  }
};

// export const sendEmail = async (email: string, username: string, name: string): Promise<string> => {
//   try {
//       const response = await axiosClient.post('/email/send', { email, username, name });
//       return response.data.message || 'Email sent successfully!';

//   } catch (error) {
//     console.error('Failed to send email:', error);
//     throw new Error('Failed to send email');
//   }
// };
