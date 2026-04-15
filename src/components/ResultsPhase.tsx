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

  const getRankedTypes = () => {
    const types = [
      { key: 'T' as const, label: 'Thinking (T)', count: tCount },
      { key: 'C' as const, label: 'Communication (C)', count: cCount },
      { key: 'L' as const, label: 'Leadership (L)', count: lCount },
    ];
    return types.sort((a, b) => b.count - a.count);
  };

  const ranked = getRankedTypes();
  const dominantLabel = totalClassified === 0 ? '未分類' : `${ranked[0].label} タイプ`;

  // 上位2つの組み合わせでプロファイルを決定
  const topTwo = totalClassified > 0 ? [ranked[0].key, ranked[1].key].sort().join('') : '';

  const profileMap: Record<string, { title: string; strengths: string[]; jobs: string[]; description: string }> = {
    'CT': {
      title: '戦略的アナリスト × コミュニケーター',
      strengths: [
        '複雑な情報をわかりやすく伝える力',
        'データや論理に基づいた説得力',
        '教える・解説する能力が高い',
        '問題の本質を見抜き、的確にフィードバックできる',
      ],
      jobs: [
        'コンサルタント', 'データアナリスト', 'UXリサーチャー', '教師・講師',
        'テクニカルライター', 'プロダクトマネージャー', '研修トレーナー',
        'マーケティングストラテジスト', 'サイエンスコミュニケーター',
      ],
      description: '深く考え抜いた知見を、相手に合わせてわかりやすく届けることができるタイプです。「なぜそうなるか」を論理的に説明しながら、相手の理解や共感も引き出せる稀有なバランスを持っています。',
    },
    'LT': {
      title: '戦略的リーダー × シンカー',
      strengths: [
        'ビジョンと戦略の両方を描ける',
        'データに基づく的確な意思決定',
        '長期視点で物事を構想する力',
        '仕組みや制度を設計して組織を動かせる',
      ],
      jobs: [
        'CTO・技術責任者', '経営企画', '事業戦略コンサルタント', 'プロダクトオーナー',
        'システムアーキテクト', '起業家', 'R&Dマネージャー', '投資アナリスト',
        'ゲームデザイナー（設計型）',
      ],
      description: '論理と実行力を兼ね備え、「考えて→決めて→動かす」ができるタイプです。戦略を立てるだけでなく、自らリスクを取って推進できるため、新規事業や大きな変革に向いています。',
    },
    'CL': {
      title: 'ピープルリーダー × コミュニケーター',
      strengths: [
        '人を巻き込み、チームをまとめる力',
        '相手のモチベーションを引き出す共感力',
        '対人関係を築きながら組織を導く力',
        'ビジョンを語り、人の心を動かせる',
      ],
      jobs: [
        '営業マネージャー', 'HRマネージャー・人事', 'スクラムマスター', 'カスタマーサクセス',
        'コミュニティマネージャー', 'イベントプロデューサー', '政治家・議員',
        'NPO/NGOリーダー', '採用担当・リクルーター',
      ],
      description: '人の気持ちに寄り添いながら、チームや組織を目標に向かって動かせるタイプです。信頼関係をベースにしたリーダーシップが最大の武器で、周囲が自然とついてくる求心力があります。',
    },
  };

  // 単一突出型
  const singleDominantMap: Record<string, { title: string; strengths: string[]; jobs: string[]; description: string }> = {
    'T': {
      title: 'ディープシンカー',
      strengths: [
        '物事を深く考え抜く集中力',
        '複雑な問題を構造化して解く力',
        '専門性を極める探究心',
        '独自の視点から本質を見抜く洞察力',
      ],
      jobs: [
        '研究者・科学者', 'エンジニア', 'データサイエンティスト', 'アナリスト',
        '哲学者・思想家', '発明家', 'ゲームデザイナー', 'プログラマー', '建築家',
      ],
      description: '考えること自体がエネルギー源のタイプです。じっくり腰を据えて分析・研究し、独自の発見や発明を生み出す力があります。一人で深く潜れる環境で最大のパフォーマンスを発揮します。',
    },
    'C': {
      title: 'コミュニケーションマスター',
      strengths: [
        '誰とでも信頼関係を築ける親和力',
        '相手の立場に立って考える共感力',
        '伝える力・聴く力の両方が高い',
        '場の空気を読み、調和を生み出す力',
      ],
      jobs: [
        'カウンセラー・セラピスト', '広報・PR', '編集者・ライター', '教師・インストラクター',
        '通訳・翻訳者', 'ラジオパーソナリティ', '司会者', '看護師', 'ソーシャルワーカー',
      ],
      description: '人とのつながりの中で力を発揮するタイプです。聴く・話す・書く・教えるなど、あらゆるコミュニケーション手段を通じて価値を届けることができます。人の輪の中心にいることが自然体です。',
    },
    'L': {
      title: 'ボーンリーダー',
      strengths: [
        '即断即決できる決断力',
        '困難に立ち向かう胆力と行動力',
        '周囲を巻き込み、推進する突破力',
        'ゼロから何かを立ち上げる起業家精神',
      ],
      jobs: [
        'CEO・経営者', 'プロジェクトマネージャー', '起業家', '軍人・指揮官',
        'プロデューサー', '政治家', '監督・コーチ', '消防士・レスキュー隊員', '探検家',
      ],
      description: '自ら決断し、先頭に立って道を切り開くタイプです。リスクを恐れず行動し、周囲を巻き込みながら大きな目標を達成する力があります。逆境でこそ真価を発揮するタフさが魅力です。',
    },
  };

  const getProfile = () => {
    if (totalClassified === 0) return null;
    // 1位と2位の差が小さい場合は組み合わせ型、大きい場合は単一突出型
    const gap = ranked[0].count - ranked[1].count;
    const ratio = totalClassified > 0 ? gap / totalClassified : 0;
    if (ratio > 0.3) {
      return singleDominantMap[ranked[0].key];
    }
    return profileMap[topTwo] ?? singleDominantMap[ranked[0].key];
  };

  const profile = getProfile();

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
              あなたは <strong>{dominantLabel}</strong> です。
            </p>
            <p className="description">
              {totalClassified < 30
                ? '分類した動詞の数がまだ少ないようです。多く選ぶほど、より正確な傾向が見えてきます。'
                : 'この結果は、あなたが「無意識に選んでいる行動」の傾向を示しています。突出している分野があなたの「天然の強み」です。'}
            </p>
          </div>

          {profile && totalClassified >= 10 && (
            <>
              <div className="profile-section">
                <h4>{profile.title}</h4>
                <p className="profile-description">{profile.description}</p>
              </div>

              <div className="strengths-section">
                <h4>得意なこと</h4>
                <ul>
                  {profile.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="jobs-section">
                <h4>向いている仕事・役割</h4>
                <div className="job-tags">
                  {profile.jobs.map((j, i) => (
                    <span key={i} className="job-tag">{j}</span>
                  ))}
                </div>
              </div>
            </>
          )}
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

        .profile-section {
          margin-top: 20px;
          padding: 20px;
          background: #f0fdf4;
          border-radius: 8px;
          border-left: 4px solid #22c55e;
        }
        .profile-section h4 {
          margin: 0 0 10px 0;
          color: #15803d;
          font-size: 16px;
        }
        .profile-description {
          font-size: 14px;
          line-height: 1.8;
          color: #374151;
          margin: 0;
        }

        .strengths-section {
          margin-top: 16px;
          padding: 20px;
          background: #fefce8;
          border-radius: 8px;
          border-left: 4px solid #eab308;
        }
        .strengths-section h4 {
          margin: 0 0 12px 0;
          color: #a16207;
          font-size: 16px;
        }
        .strengths-section ul {
          margin: 0;
          padding-left: 20px;
        }
        .strengths-section li {
          font-size: 14px;
          line-height: 1.8;
          color: #374151;
        }

        .jobs-section {
          margin-top: 16px;
          padding: 20px;
          background: #faf5ff;
          border-radius: 8px;
          border-left: 4px solid #a855f7;
        }
        .jobs-section h4 {
          margin: 0 0 12px 0;
          color: #7e22ce;
          font-size: 16px;
        }
        .job-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .job-tag {
          padding: 6px 12px;
          background: white;
          border: 1px solid #e9d5ff;
          border-radius: 20px;
          font-size: 13px;
          color: #6b21a8;
        }
      `}</style>
    </div>
  );
};
