import React, { useRef } from 'react';
import Modal from './Modal';
import MatchReport from './MatchReport';
import Button from './Button';
import { FaPrint } from 'react-icons/fa';

export default function ReportPreviewModal({ isOpen, onClose, session, user }) {
    const reportRef = useRef();

    const handlePrint = () => {
        const printContent = reportRef.current;
        const windowUrl = 'about:blank';
        const uniqueName = new Date();
        const windowName = 'Print' + uniqueName.getTime();
        const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Report</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            @page { size: A4; margin: 0; }
                            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
                        </style>
                    </head>
                    <body>
                        ${printContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        } else {
            alert('Please allow popups to print report');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Report Preview"
            className="max-w-4xl"
        >
            <div className="flex flex-col space-y-6">
                {/* Preview Area - styled with dark background to make the white paper pop */}
                <div className="flex-1 bg-dark-bg/50 p-6 rounded-xl border border-dark-border overflow-auto max-h-[60vh] flex justify-center">
                    <div className="shadow-2xl scale-90 origin-top">
                        <MatchReport ref={reportRef} session={session} user={user} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-dark-border">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700">
                        <FaPrint className="mr-2" /> Print Report
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
