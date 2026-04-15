import React, { useRef } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { Download, Info } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { Verb } from '../types';

interface Props {
  verbs: Verb[];
}

export const ResultsPhase: React.FC<Props> = ({ verbs }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const tCount = verbs.filter(v => v.category === 'T').length;
  const cCount = verbs.filter(v => v.category === 'C').length;
  const lCount = verbs.filter(v => v.category === 'L').length;
  const totalClassified = tCount + cCount + lCount;

  const chartData = [
    { subject: 'Thinking (T)', A: tCount, fullMark: Math.max(tCount, cCount, lCount, 10) },
    { subject: 'Communication (C)', A: cCount, fullMark: Math.max(tCount, cCount, lCount, 10) },
    { subject: 'Leadership (L)', A: lCount, fullMark: Math.max(tCount, cCount, lCount, 10) },
  ];

  const getDominantType = () => {
    if (totalClassified === 0) return '未分類';
    const max = Math.max(tCount, cCount, lCount);
    if (tCount === max) return 'Thinking (T) タイプ';
    if (cCount === max) return 'Communication (C) タイプ';
    return 'Leadership (L) タイプ';
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`TCL-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="results-phase">
      <div className="phase-header">
        <h2>3. 分析結果の可視化</h2>
        <p>あなたの強みのバランスがレーダーチャートで表示されます。このレポートはPDFとして保存可能です。</p>
        <button onClick={exportPDF} className="primary export-btn" disabled={totalClassified === 0}>
          <Download size={18} />
          PDFとして書き出し
        </button>
      </div>

      <div className="report-container" ref={reportRef}>
        <div className="report-card">
          <h3>TCL資質バランス・レポート</h3>
          
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="stats-grid">
            <div className="stat-item T">
              <span className="label">Thinking</span>
              <span className="value">{tCount}</span>
            </div>
            <div className="stat-item C">
              <span className="label">Communication</span>
              <span className="value">{cCount}</span>
            </div>
            <div className="stat-item L">
              <span className="label">Leadership</span>
              <span className="value">{lCount}</span>
            </div>
          </div>

          <div className="conclusion">
            <h4>
              <Info size={20} />
              あなたの傾向
            </h4>
            <p className="dominant-text">
              あなたは <strong>{getDominantType()}</strong> です。
            </p>
            <p className="description">
              {totalClassified < 30 ? (
                '分類した動詞の数がまだ少ないようです。100個に近づくほど、より正確な傾向が見えてきます。'
              ) : (
                'この結果は、あなたが「無意識に選んでいる行動」の傾向を示しています。突出している分野があなたの「天然の強み」です。'
              )}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .results-phase {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          overflow-y: auto;
        }
        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }
        .report-container {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
        }
        .report-card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        .report-card h3 {
          text-align: center;
          margin-top: 0;
          color: #1e293b;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 15px;
        }
        .chart-wrapper {
          margin: 20px 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border-radius: 8px;
          background: #f8fafc;
        }
        .stat-item .label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 5px;
        }
        .stat-item .value {
          font-size: 24px;
          font-weight: bold;
        }
        .stat-item.T { border-left: 4px solid var(--color-postit-t); }
        .stat-item.C { border-left: 4px solid var(--color-postit-c); }
        .stat-item.L { border-left: 4px solid var(--color-postit-l); }

        .conclusion {
          background: #eff6ff;
          padding: 20px;
          border-radius: 8px;
          color: #1e40af;
        }
        .conclusion h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px 0;
        }
        .dominant-text {
          font-size: 18px;
          margin: 0 0 10px 0;
        }
        .description {
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
