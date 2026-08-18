import { apiClient } from './api';

export interface DashboardStats {
  pendingAppointments: number;
  unreadMessages: number;
  pendingCaseReviews: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    if (res.ok && res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('[dashboardService Warning] Error fetching dashboard stats:', error);
  }
  return {
    pendingAppointments: 0,
    unreadMessages: 0,
    pendingCaseReviews: 0,
  };
}
