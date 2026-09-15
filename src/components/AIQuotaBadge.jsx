import {Gauge} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';

const AIQuotaBadge = () => {
    const {token} = useSelector((state) => state.auth);
    const [quota, setQuota] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const loadQuota = () => api.get('/api/ai/quota', {headers: {Authorization: token}}).then(({data}) => {
            if (isMounted) setQuota(data);
        }).catch(() => {});
        loadQuota();
        window.addEventListener('resuai:ai-complete', loadQuota);
        return () => {isMounted = false; window.removeEventListener('resuai:ai-complete', loadQuota)};
    }, [token]);

    if (!quota) return null;
    return <div className='mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs' aria-label='AI usage quota'><span className='flex items-center gap-2 font-medium text-slate-600'><Gauge className='size-3.5 text-slate-400' /> AI credits today</span><span className={`font-semibold ${quota.remaining <= 5 ? 'text-amber-700' : 'text-slate-800'}`}>{quota.remaining} remaining</span></div>;
};

export default AIQuotaBadge;
