
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthPageProps {
  onBack: () => void;
  onLogin: (email: string, isSeller: boolean, isSignUp: boolean) => void;
  error?: string | null;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const isAdmin = email.toLowerCase() === 'loca@gmail.com';
        
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: email.split('@')[0],
          email: email,
          isSeller: role === 'seller',
          isAdmin: isAdmin,
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });
        
        onLogin(email, role === 'seller', true);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        const userData = userDoc.data();
        onLogin(email, userData?.isSeller || false, false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
      <div className="md:w-1/2 bg-[#049454] p-12 md:p-24 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10">
          <button onClick={onBack} className="flex items-center gap-2 font-bold text-sm mb-12 hover:opacity-80 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Home
          </button>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            {role === 'customer' ? 'Your neighborhood, now in your pocket.' : 'Grow your local business with Locality.'}
          </h1>
          <p className="text-xl text-emerald-100 max-w-md font-medium">
            {role === 'customer' 
              ? 'Join thousands of neighbors supporting local businesses every day.' 
              : 'Reach more local customers and manage your neighborhood deliveries with ease.'}
          </p>
        </div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h2>
            
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-4 rounded-2xl">
                <p className="text-sm font-bold text-rose-500">{error}</p>
              </div>
            )}
            
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
              <button 
                type="button"
                onClick={() => setRole('customer')}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${role === 'customer' ? 'bg-white dark:bg-slate-700 text-[#049454] shadow-sm' : 'text-slate-400'}`}
              >
                Customer
              </button>
              <button 
                type="button"
                onClick={() => setRole('seller')}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${role === 'seller' ? 'bg-white dark:bg-slate-700 text-[#049454] shadow-sm' : 'text-slate-400'}`}
              >
                Seller
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 transition-all font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 transition-all font-medium" 
              />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#049454] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/10 hover:bg-[#037c46] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50">
              {loading ? 'Processing...' : (mode === 'signin' ? `Sign In` : `Join Now`)}
            </button>
          </form>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm font-bold text-[#049454] hover:underline"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
