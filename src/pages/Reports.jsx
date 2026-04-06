import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { PageHeader } from '../components/ui/PageHeader';
import { FormField } from '../components/ui/FormField';
import { FileBarChart, Calendar, ChevronRight } from 'lucide-react';

const REPORTS = [
  { id: 'hall-managers', title: 'Hall Managers', endpoint: '/reports/hall-managers' },
  { id: 'students-with-leases', title: 'Students with Leases', endpoint: '/reports/students-with-leases' },
  { id: 'summer-leases', title: 'Summer Leases', endpoint: '/reports/summer-leases' },
  { id: 'total-rent-paid', title: 'Total Rent Paid by Student', endpoint: '/reports/total-rent-paid', requiresStudent: true },
  { id: 'unpaid-invoices', title: 'Unpaid Invoices by Date', endpoint: '/reports/unpaid-invoices', requiresDate: true },
  { id: 'unsatisfactory-inspections', title: 'Unsatisfactory Inspections', endpoint: '/reports/unsatisfactory-inspections' },
  { id: 'students-in-hall', title: 'Students in Hall', endpoint: '/reports/students-in-hall', requiresHall: true },
  { id: 'waiting-list', title: 'Waiting List Students', endpoint: '/reports/waiting-list' },
  { id: 'students-by-category', title: 'Students by Category', endpoint: '/reports/students-by-category' },
  { id: 'students-no-next-of-kin', title: 'Students No Next of Kin', endpoint: '/reports/students-no-next-of-kin' },
  { id: 'adviser-for-student', title: 'Adviser for Student', endpoint: '/reports/adviser-for-student', requiresStudent: true },
  { id: 'rent-statistics', title: 'Rent Statistics', endpoint: '/reports/rent-statistics' },
  { id: 'places-per-hall', title: 'Places per Hall', endpoint: '/reports/places-per-hall' },
  { id: 'staff-over-sixty', title: 'Staff Over Sixty', endpoint: '/reports/staff-over-sixty' },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStudentId, setFilterStudentId] = useState('');
  const [filterHallId, setFilterHallId] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const token = localStorage.getItem('token');

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/students').then(res => res.data.data || []),
    enabled: !!token
  });

  const { data: halls = [] } = useQuery({
    queryKey: ['halls'],
    queryFn: () => api.get('/halls').then(res => res.data.data || []),
    enabled: !!token
  });

  const currentReport = REPORTS.find(r => r.id === selectedReport);

  const buildEndpoint = () => {
    if (!currentReport) return null;
    let url = currentReport.endpoint;
    if (currentReport.requiresStudent && filterStudentId) url += `/${filterStudentId}`;
    if (currentReport.requiresHall && filterHallId) url += `/${filterHallId}`;
    if (currentReport.requiresDate && filterDate) url += `?byDate=${filterDate}`;
    if (currentReport.requiresStudent && !filterStudentId) return null;
    if (currentReport.requiresHall && !filterHallId) return null;
    if (currentReport.requiresDate && !filterDate) return null;
    return url;
  };

  const endpointUrl = buildEndpoint();

  const { data: reportData, isLoading, isError, error } = useQuery({
    queryKey: ['report', selectedReport, endpointUrl, filterDate, filterHallId, filterStudentId],
    queryFn: () => api.get(endpointUrl).then(res => res.data.data),
    enabled: !!token && !!endpointUrl,
    retry: false
  });

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="Analytics & Reports" description="View management reports and statistical summaries." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report List */}
        <div className="lg:col-span-1 space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 modal-scroll">
          {REPORTS.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                selectedReport === report.id
                  ? 'bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] hover:bg-[var(--color-primary-accent)]/20'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <div className="flex items-center min-w-0">
                <FileBarChart className={`w-4 h-4 mr-2.5 flex-shrink-0 ${selectedReport === report.id ? 'text-[var(--color-primary-accent)]' : 'text-[var(--color-text-muted)]'}`} />
                <span className="text-left truncate">{report.title}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ml-2 transition-transform duration-300 ${selectedReport === report.id ? 'text-[var(--color-primary-accent)] translate-x-1' : 'text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 translate-x-0'}`} />
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          {currentReport ? (
            <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]/60 p-6 min-h-[500px]">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6 pb-4 border-b border-[var(--color-border)]">
                {currentReport.title}
              </h2>

              {/* Filters */}
              {(currentReport.requiresStudent || currentReport.requiresHall || currentReport.requiresDate) && (
                <div className="flex flex-wrap items-end gap-4 mb-8 bg-[var(--color-surface-hover)] p-4 rounded-lg">
                  {currentReport.requiresStudent && (
                    <div className="w-64">
                      <FormField label="Select Student" type="select" value={filterStudentId} onChange={(e) => setFilterStudentId(e.target.value)} options={students.map(s => ({ label: `${s.firstName} ${s.lastName}`, value: s.studentId }))} />
                    </div>
                  )}
                  {currentReport.requiresHall && (
                    <div className="w-64">
                      <FormField label="Select Hall" type="select" value={filterHallId} onChange={(e) => setFilterHallId(e.target.value)} options={halls.map(h => ({ label: h.hallName, value: h.hallId }))} />
                    </div>
                  )}
                  {currentReport.requiresDate && (
                    <div className="w-64">
                      <FormField label="Select Date" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                    </div>
                  )}
                </div>
              )}

              {/* Data */}
              {isLoading ? (
                <div className="py-20 text-center text-[var(--color-text-muted)] flex flex-col items-center">
                  <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-sm">Generating report data...</p>
                </div>
              ) : isError ? (
                <div className="bg-[var(--color-danger-accent)]/10 border border-[var(--color-danger-accent)]/20 text-[var(--color-danger-accent)] p-4 rounded-xl text-sm">
                  Failed to load report: {error.response?.data?.message || error.message}
                </div>
              ) : !endpointUrl ? (
                <div className="py-20 text-center text-[var(--color-text-muted)] bg-[var(--color-surface-hover)]/30 rounded-xl flex flex-col items-center border border-dashed border-[var(--color-border)]">
                  <Calendar className="w-12 h-12 text-[var(--color-text-muted)]/50 mb-4" />
                  <p className="text-sm">
                    {currentReport?.requiresDate 
                      ? "Select a date to view unpaid invoices" 
                      : "Please select required filters to generate this report."}
                  </p>
                </div>
              ) : reportData ? (
                <div className="overflow-x-auto">
                  {selectedReport === 'students-by-category' && reportData.countsByCategory ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.entries(reportData.countsByCategory).map(([category, count]) => (
                        <div key={category} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 text-center shadow-xl shadow-black/5 hover:-translate-y-1 hover:border-[var(--color-primary-accent)]/50 transition-all duration-300 relative overflow-hidden group">
                           {/* Subtle tint background */}
                          <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300 text-[var(--color-primary-accent)] pointer-events-none"></div>
                          <div className="text-4xl font-display font-bold text-[var(--color-text-primary)] mb-2 relative z-10">{count}</div>
                          <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider relative z-10">{category.replace('_', ' ')}</div>
                        </div>
                      ))}
                    </div>
                  ) : Array.isArray(reportData) && reportData.length > 0 ? (
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-[var(--color-border)]">
                          {Object.keys(reportData[0]).filter(k => typeof reportData[0][k] !== 'object').map(key => (
                            <th key={key} className="px-4 py-3 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-surface-hover)]/50">{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222222]">
                        {reportData.map((row, i) => (
                          <tr key={i} className="hover:bg-[var(--color-surface-hover)]/70 transition-colors">
                            {Object.entries(row).filter(([, v]) => typeof v !== 'object').map(([, val], j) => (
                              <td key={j} className="px-4 py-3 text-[var(--color-text-secondary)]">{val != null ? String(val) : 'N/A'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : typeof reportData === 'object' && reportData !== null && !Array.isArray(reportData) ? (
                    <div className="space-y-6">
                      {/* Render top-level scalar fields as summary cards */}
                      {(() => {
                        const scalarEntries = Object.entries(reportData).filter(([, v]) => typeof v !== 'object' || v === null);
                        const arrayEntries = Object.entries(reportData).filter(([, v]) => Array.isArray(v));
                        const objectEntries = Object.entries(reportData).filter(([, v]) => typeof v === 'object' && v !== null && !Array.isArray(v));
                        return (
                          <>
                            {scalarEntries.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {scalarEntries.map(([key, val]) => (
                                  <div key={key} className="bg-[var(--color-surface-hover)] border border-[var(--color-border)]/60 rounded-xl p-4">
                                    <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    <div className="text-lg font-semibold text-[var(--color-text-primary)]">{val != null ? String(val) : 'N/A'}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {arrayEntries.map(([key, arr]) => (
                              <div key={key}>
                                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                {arr.length > 0 ? (
                                  <table className="w-full text-sm text-left">
                                    <thead>
                                      <tr className="border-b border-[var(--color-border)]">
                                        {Object.keys(arr[0]).filter(k => typeof arr[0][k] !== 'object').map(col => (
                                          <th key={col} className="px-4 py-3 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-surface-hover)]/50">{col.replace(/([A-Z])/g, ' $1').trim()}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#222222]">
                                      {arr.map((row, i) => (
                                        <tr key={i} className="hover:bg-[var(--color-surface-hover)]/70 transition-colors">
                                          {Object.entries(row).filter(([, v]) => typeof v !== 'object').map(([, val], j) => (
                                            <td key={j} className="px-4 py-3 text-[var(--color-text-secondary)]">{val != null ? String(val) : 'N/A'}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p className="text-sm text-[var(--color-text-muted)]">No records found.</p>
                                )}
                              </div>
                            ))}
                            {objectEntries.map(([key, obj]) => (
                              <div key={key}>
                                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                  {Object.entries(obj).map(([k, v]) => (
                                    <div key={k} className="bg-[var(--color-surface-hover)] border border-[var(--color-border)]/60 rounded-xl p-4">
                                      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                                      <div className="text-lg font-semibold text-[var(--color-text-primary)]">{v != null ? String(v) : 'N/A'}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-[var(--color-text-muted)] text-sm">No data found for the selected criteria.</div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-[var(--color-text-muted)] text-sm">No data found for the selected criteria.</div>
              )}
            </div>
          ) : (
            <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]/60 p-12 text-center h-full flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-6">
                <FileBarChart className="w-8 h-8 accent-white text-[var(--color-text-primary)]/40" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Select a Report</h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
                Choose a report from the menu on the left to view data analytics and summaries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
