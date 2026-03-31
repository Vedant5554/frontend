import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Download } from 'lucide-react';
import { formatSemester } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function MyInvoices({ userId }) {
  const token = localStorage.getItem('token');
  const [downloadingId, setDownloadingId] = useState(null);

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['my-invoices', userId],
    queryFn: () => api.get(`/invoices/student/${userId}`).then(res => res.data.data || []),
    enabled: !!token
  });

  const downloadInvoice = async (invoiceId) => {
    try {
      setDownloadingId(invoiceId);
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      });
      console.log('Download response:', response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch (error) {
      console.error('Download failed', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    { header: 'Invoice #', render: (row) => row.invoiceNumber || `#${row.invoiceId}` },
    { header: 'Semester', render: (row) => <Badge color="indigo">{formatSemester(row.semester)}</Badge> },
    { header: 'Due Date', render: (row) => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A' },
    { header: 'Amount', render: (row) => `£${row.amount}` },
    { header: 'Payment Method', render: (row) => row.paymentMethod || 'N/A' },
    {
      header: 'Status', render: (row) => (
        row.status === 'PAID' ? <Badge color="green">Paid</Badge> :
          row.status === 'OVERDUE' ? <Badge color="red">Overdue</Badge> :
            <Badge color="amber">{row.status || 'Pending'}</Badge>
      )
    },
    { header: '1st Reminder', render: (row) => row.firstReminderDate ? new Date(row.firstReminderDate).toLocaleDateString() : '—' },
    { header: '2nd Reminder', render: (row) => row.secondReminderDate ? new Date(row.secondReminderDate).toLocaleDateString() : '—' },
    {
      header: 'Download', render: (row) => (
        <button
          className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#111111] transition-all disabled:opacity-50"
          title="Download PDF"
          disabled={downloadingId === row.invoiceId}
          onClick={() => downloadInvoice(row.invoiceId)}
        >
          {downloadingId === row.invoiceId
            ? <span className="w-4 h-4 block border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            : <Download className="w-4 h-4" />}
        </button>
      )
    }
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="My Invoices" description="View your rent invoices and payment statuses." />
      <Table columns={columns} data={invoices} isLoading={isLoading} />
    </div>
  );
}
