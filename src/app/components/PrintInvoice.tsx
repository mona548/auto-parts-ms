import { useSettings } from "../context/SettingsContext";

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

interface PrintInvoiceProps {
  invoiceId: string;
  date: string;
  customer: {
    name: string;
    phone: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  total: number;
  paid?: number;
  remaining?: number;
  notes?: string;
  showPrint?: boolean;
}

export default function PrintInvoice({
  invoiceId,
  date,
  customer,
  items,
  subtotal,
  discount = 0,
  total,
  paid = 0,
  remaining = 0,
  notes,
  showPrint = false,
}: PrintInvoiceProps) {
  const { settings } = useSettings();

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice,
          #print-invoice * {
            visibility: visible;
          }
          #print-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          body {
            direction: rtl;
          }
          .no-print {
            display: none !important;
          }
        }

        @page {
          size: A4;
          margin: 15mm;
        }

        #print-invoice {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          line-height: 1.6;
          color: #333;
          direction: rtl;
          text-align: right;
        }

        #print-invoice .print-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 4px solid #2563eb;
          padding-bottom: 15px;
        }

        #print-invoice .print-header h1 {
          font-size: 24px;
          font-weight: bold;
          color: #1e40af;
          margin: 0 0 8px 0;
        }

        #print-invoice .print-header p {
          margin: 3px 0;
          font-size: 11px;
          color: #666;
        }

        #print-invoice .invoice-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 6px;
        }

        #print-invoice .invoice-info-section {
          flex: 1;
        }

        #print-invoice .invoice-info-label {
          font-size: 10px;
          color: #64748b;
          margin-bottom: 3px;
        }

        #print-invoice .invoice-info-value {
          font-weight: bold;
          color: #1e293b;
          font-size: 13px;
        }

        #print-invoice .customer-info {
          background: #eff6ff;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          border-right: 4px solid #2563eb;
        }

        #print-invoice .customer-info-row {
          display: flex;
          gap: 30px;
          margin-bottom: 5px;
        }

        #print-invoice .customer-info-row:last-child {
          margin-bottom: 0;
        }

        #print-invoice .customer-label {
          font-size: 10px;
          color: #1e40af;
          font-weight: 600;
        }

        #print-invoice .customer-value {
          font-weight: bold;
          color: #1e293b;
        }

        #print-invoice table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        #print-invoice thead {
          background: #2563eb;
          color: white;
        }

        #print-invoice th {
          padding: 10px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 11px;
        }

        #print-invoice th:first-child {
          text-align: right;
        }

        #print-invoice th:last-child {
          text-align: left;
        }

        #print-invoice td {
          padding: 8px;
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
        }

        #print-invoice td:first-child {
          text-align: right;
          color: #64748b;
          font-size: 10px;
        }

        #print-invoice td:last-child {
          text-align: left;
          font-weight: bold;
          color: #1e293b;
        }

        #print-invoice tbody tr:hover {
          background: #f8fafc;
        }

        #print-invoice .totals-section {
          margin-top: 20px;
          display: flex;
          justify-content: flex-start;
          gap: 20px;
        }

        #print-invoice .totals-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
          min-width: 250px;
        }

        #print-invoice .totals-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        #print-invoice .totals-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        #print-invoice .totals-row.grand-total {
          border-top: 2px solid #2563eb;
          padding-top: 10px;
          margin-top: 10px;
          font-size: 14px;
        }

        #print-invoice .totals-label {
          color: #64748b;
          font-size: 11px;
        }

        #print-invoice .totals-value {
          font-weight: bold;
          color: #1e293b;
        }

        #print-invoice .totals-value.positive {
          color: #059669;
        }

        #print-invoice .totals-value.negative {
          color: #dc2626;
        }

        #print-invoice .totals-value.grand {
          color: #2563eb;
          font-size: 16px;
        }

        #print-invoice .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
        }

        #print-invoice .footer-thanks {
          font-size: 14px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }

        #print-invoice .footer-notes {
          font-size: 10px;
          color: #64748b;
          font-style: italic;
          margin-top: 10px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 4px;
        }

        #print-invoice .footer-system {
          font-size: 9px;
          color: #94a3b8;
          margin-top: 15px;
        }
      `}</style>

      {/* Print Content */}
      <div id="print-invoice" className={showPrint ? "" : "hidden"}>
        {/* Header */}
        <div className="print-header">
          <h1>{settings.shopName}</h1>
          <p>الهاتف: {settings.phoneNumber}</p>
          <p>العنوان: {settings.address}</p>
        </div>

        {/* Invoice Info */}
        <div className="invoice-info">
          <div className="invoice-info-section">
            <div className="invoice-info-label">رقم الفاتورة</div>
            <div className="invoice-info-value">{invoiceId}</div>
          </div>
          <div className="invoice-info-section" style={{ textAlign: 'left' }}>
            <div className="invoice-info-label">التاريخ والوقت</div>
            <div className="invoice-info-value">
              {new Date(date).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' - '}
              {new Date().toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="customer-info">
          <div className="customer-info-row">
            <div>
              <span className="customer-label">اسم العميل: </span>
              <span className="customer-value">{customer.name}</span>
            </div>
            <div>
              <span className="customer-label">رقم الهاتف: </span>
              <span className="customer-value">{customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم الصنف</th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ textAlign: 'right', fontWeight: '500' }}>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price.toLocaleString()} {settings.currency}</td>
                <td>{(item.qty * item.price).toLocaleString()} {settings.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="totals-section">
          <div className="totals-box">
            <div className="totals-row">
              <span className="totals-label">الإجمالي الجزئي</span>
              <span className="totals-value">{subtotal.toLocaleString()} {settings.currency}</span>
            </div>

            {discount > 0 && (
              <div className="totals-row">
                <span className="totals-label">الخصم</span>
                <span className="totals-value negative">- {discount.toLocaleString()} {settings.currency}</span>
              </div>
            )}

            <div className="totals-row grand-total">
              <span className="totals-label">الإجمالي الكلي</span>
              <span className="totals-value grand">{total.toLocaleString()} {settings.currency}</span>
            </div>

            {paid > 0 && (
              <>
                <div className="totals-row">
                  <span className="totals-label">المبلغ المدفوع</span>
                  <span className="totals-value positive">{paid.toLocaleString()} {settings.currency}</span>
                </div>

                {remaining > 0 && (
                  <div className="totals-row">
                    <span className="totals-label">المتبقي</span>
                    <span className="totals-value negative">{remaining.toLocaleString()} {settings.currency}</span>
                  </div>
                )}

                {remaining === 0 && paid > 0 && (
                  <div className="totals-row">
                    <span className="totals-label">الحالة</span>
                    <span className="totals-value positive">✓ مسدد بالكامل</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-thanks">شكراً لتعاملكم معنا</div>

          {notes && (
            <div className="footer-notes">
              <strong>ملاحظات:</strong> {notes}
            </div>
          )}

          {settings.defaultInvoiceNote && !notes && (
            <div className="footer-notes">{settings.defaultInvoiceNote}</div>
          )}

          <div className="footer-system">نظام إدارة قطع الغيار</div>
        </div>
      </div>
    </>
  );
}
