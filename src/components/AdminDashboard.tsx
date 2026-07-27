import React, { useState } from 'react';
import { DiscountItem, DataEngineLog, AdminStats } from '../types';
import { CollectorStatus, PipelineSummary } from '../engine/types';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Server, 
  Database, 
  ShieldCheck, 
  Link2Off, 
  Calendar, 
  PieChart, 
  Layers, 
  Lock,
  Cpu
} from 'lucide-react';

interface AdminDashboardProps {
  items: DiscountItem[];
  logs: DataEngineLog[];
  stats: AdminStats;
  collectorStatuses?: CollectorStatus[];
  pipelineSummary?: PipelineSummary;
  rejectedReasons?: string[];
  onRunEngineTrigger: () => void;
  onSimulateLinkCheck: () => void;
  onRunSingleCollector?: (platform: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  items,
  logs,
  stats,
  collectorStatuses = [],
  pipelineSummary,
  rejectedReasons = [],
  onRunEngineTrigger,
  onSimulateLinkCheck,
  onRunSingleCollector,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kr_delivery_admin_authed') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '7777' || pinInput === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('kr_delivery_admin_authed', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kr_delivery_admin_authed');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">데이터 엔진 Admin 관제 센터</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            실시간 데이터 상태 검증 및 시스템 관제용 관리자 영역입니다.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-3 pt-2">
          <input
            type="password"
            placeholder="관리자 암호 입력 (초기: 7777)"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold text-center outline-none focus:border-rose-500"
          />
          {pinError && <p className="text-xs font-bold text-rose-500">암호가 일치하지 않습니다. (테스트용: 7777)</p>}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-bold text-sm transition-transform active:scale-95"
          >
            관제 시스템 접속
          </button>
        </form>
      </div>
    );
  }

  const filteredLogs = filterCategory === 'ALL' ? logs : logs.filter(l => l.category === filterCategory);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-sm">
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black">실시간 데이터 엔진 Admin 관제</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase">
                SYSTEM LIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">실시간 검증, 링크 헬스체크, 신뢰도 점수 및 중복 교체 현황</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunEngineTrigger}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
            엔진 수동 실행
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>총 이벤트</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalEvents}</div>
          <div className="text-[10px] text-slate-400">전체 수집 항목</div>
        </div>

        {/* Active */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-950/60 p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>활성 이벤트</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.activeEvents}</div>
          <div className="text-[10px] text-emerald-500/80">정상 노출 중</div>
        </div>

        {/* Deactivated */}
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-950/60 p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
            <span>비활성/삭제</span>
            <XCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.deactivatedEvents}</div>
          <div className="text-[10px] text-amber-500/80">만료/미갱신 데이터</div>
        </div>

        {/* Link Errors */}
        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/60 p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between">
            <span>링크 오류</span>
            <Link2Off className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.linkErrorEvents}</div>
          <div className="text-[10px] text-rose-500/80">404/삭제/품절</div>
        </div>

        {/* Added Today */}
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-950/60 p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between">
            <span>오늘 추가</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.addedToday}</div>
          <div className="text-[10px] text-blue-500/80">신규 프로모션</div>
        </div>

        {/* Expiring Today */}
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-950/60 p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
            <span>오늘 마감 (D-DAY)</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.expiringToday}</div>
          <div className="text-[10px] text-purple-500/80">오늘 종료 예정</div>
        </div>
      </div>

      {/* Engine Controls & Platform Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Platform Counts Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-rose-500" />
              플랫폼별 할인 등록 현황
            </span>
            <span className="text-[11px] text-slate-400 font-bold">평균 점수: {stats.averageScore}점</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {Object.entries(stats.platformCounts).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-200">{platform}</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-black">
                  {count}개
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Diagnostic Actions */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-500" />
              데이터 품질 자동 제어 및 시뮬레이터
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">실시간 활성화됨</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            링크 자동 검사, 중복 이벤트 병합 및 24시간 이상 미갱신 항목 자동 감점 처리를 수동으로 트리거할 수 있습니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={onSimulateLinkCheck}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 bg-slate-50 dark:bg-slate-800/80 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center justify-between">
                <span>1. 링크 헬스 스캔 시뮬레이션</span>
                <Link2Off className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">HEAD/GET 요청으로 404/403/품절 감지</p>
            </button>

            <button
              onClick={onRunEngineTrigger}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 bg-slate-50 dark:bg-slate-800/80 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 flex items-center justify-between">
                <span>2. 중복 제거 & 최고 혜택 재계산</span>
                <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-teal-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">동일 브랜드 상위 할인율 자동 선택</p>
            </button>
          </div>
        </div>

      </div>

      {/* Platform Crawler Engine Status (독립 수집기 스케줄 관제) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">플랫폼별 독립 Crawler 수집 스케줄 관제</h3>
              <p className="text-[11px] text-slate-400">플랫폼별 독립 수집 주기 (30분~2시간) 및 수집 성공/실패 현황</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            독립 7개 수집기 가동 중
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collectorStatuses.map((collector) => (
            <div 
              key={collector.platform}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">{collector.platform}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {collector.scheduleMinutes}분 주기
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div className="text-slate-500 dark:text-slate-400">총 수집: <b className="text-slate-800 dark:text-slate-200">{collector.totalCollected}건</b></div>
                <div className="text-slate-500 dark:text-slate-400">상태: <b className="text-emerald-600 dark:text-emerald-400">{collector.status}</b></div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                <span>마지막 실행: {collector.lastRunAt ? collector.lastRunAt.split('T')[1].slice(0, 5) : '실행전'}</span>
                {onRunSingleCollector && (
                  <button
                    onClick={() => onRunSingleCollector(collector.platform)}
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    즉시 수집
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Audit Activity Logs Stream */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">실시간 업데이트 및 감제 로그 (Live Feed)</h3>
          </div>

          {/* Log Category Filter Tabs */}
          <div className="flex flex-wrap gap-1">
            {['ALL', 'NEW', 'EXPIRED', 'STALE', 'LINK_ERROR', 'BEST_RATE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  filterCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-rose-600 dark:text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold text-slate-400">{log.timestamp}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      log.category === 'NEW'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : log.category === 'LINK_ERROR'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : log.category === 'EXPIRED'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {log.category}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{log.message}</span>
                </div>

                {log.source && (
                  <span className="text-[10px] font-bold text-slate-400 hidden sm:inline-block">
                    [{log.source}]
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              기록된 감사 로그가 없습니다.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
