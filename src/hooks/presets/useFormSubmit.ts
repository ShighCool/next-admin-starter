import { useState, useCallback } from 'react';
import type { MessageInstance } from 'antd/es/message/interface';

interface FormSubmitOptions {
  submitApi: (values: any) => Promise<any>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  message: MessageInstance;
}

export const useFormSubmit = ({ submitApi, onSuccess, onError, message }: FormSubmitOptions) => {
  const [loading, setLoading] = useState(false);
  const [form] = useState<any>(null);

  const submit = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const res = await submitApi(values);
        message.success('操作成功');
        onSuccess?.(res);
        return res;
      } catch (error: any) {
        message.error(error.message || '操作失败');
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [submitApi, onSuccess, onError]
  );

  return {
    form,
    loading,
    submit,
  };
};
