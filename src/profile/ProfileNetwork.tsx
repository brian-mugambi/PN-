import {useEffect,useState} from "react";
import {User,onAuthStateChanged} from "firebase/auth";
import {profileAuth} from "../firebase/profileFirebase";
import {Dashboard} from "./features/dashboard/Dashboard";
import {AdView} from "./features/portfolio/AdView";
import {PublicProfile} from "./features/public/PublicProfile";
import {Welcome} from "./features/welcome/Welcome";
import {VerifyEmail} from "./features/auth/VerifyEmail";
import {runTTLSweep} from "./lib/ttl";
import {useOnline} from "./lib/offline";
import {NetNotice} from "./ui/NetNotice";
import {AppBar} from "./ui/AppBar";
import {ConfirmHost} from "./ui/confirm";
import {SkeletonLines} from "./ui/feedback";
import {ActiveVideoHost} from "./ui/media";
import {ToastHost} from "./ui/toast";
import "./profile.css";

export default function ProfileNetwork({username,view}:{username?:string;view?:"ad"|"portfolio"}){
 const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[,bump]=useState(0),online=useOnline();
 useEffect(()=>onAuthStateChanged(profileAuth,u=>{setUser(u);setLoading(false);runTTLSweep();}),[]);
 useEffect(()=>{
  const id=setInterval(runTTLSweep,5*60*1000);
  return ()=>clearInterval(id);
 },[]);
 const unverified=!!user&&!user.emailVerified,viewer=unverified?null:user;
 const adMatch=/^\/profile\/([^/]+)\/(?:ad|portfolio)\/?$/.exec(typeof location!=="undefined"?location.pathname:"");
 const adUser=(view==="ad"||view==="portfolio")?username:adMatch?decodeURIComponent(adMatch[1]):undefined;
 if(adUser)return <ToastHost><NetNotice/><AppBar/><ConfirmHost><AdView key={adUser} username={adUser} user={viewer} authLoading={loading}/></ConfirmHost></ToastHost>;
 if(loading)return online?<main className="spts-page spts-boot-skel" aria-busy="true"><div className="spts-card"><SkeletonLines n={4}/></div></main>:<main className="spts-page"/>;
 return <ToastHost><NetNotice/><AppBar/><ConfirmHost><ActiveVideoHost>
  {username?<PublicProfile username={username} user={viewer}/>
   :user?(unverified?<VerifyEmail user={user} onVerified={()=>bump(n=>n+1)}/>:<Dashboard user={user}/>)
   :<Welcome done={()=>{}}/>}
 </ActiveVideoHost></ConfirmHost></ToastHost>;
  }
