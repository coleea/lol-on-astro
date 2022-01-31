import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import {basicInfoAtom, mostInfoAtom, matchesAtom, userHeaderInfoAtom} from '../recoil/summonerInfo'
import css from './UserHeader.module.scss'

const l = console.log 

export default function UserHeader() {

    const [userHeaderInfo, setUserHeaderInfo]  = useRecoilState(userHeaderInfoAtom)

    return (
        <>
            {
                userHeaderInfo && 
                <div className={css.outerWrapper}>
                    <div className={css.wrapper}>
                        <PastRanks userHeaderInfo={userHeaderInfo}/>
                        <div className={css.userSummaryWrapper}>
                            <UserPic userHeaderInfo={userHeaderInfo}/ >                            
                            <UserInfo userHeaderInfo={userHeaderInfo} />               
                        </div>
                    </div>
                </div>
            }           
        </>
    )
}



function PastRanks({userHeaderInfo}){
    return (
        <ul className={css.pastRankList}>
            {userHeaderInfo.prevTiers.slice(0).reverse().map((v,i)=> (                                
                <li className={css.pastRankItem} key={i}>
                    <b>S{v.season}</b> {v.tier}
                </li>))}
        </ul>       
    )
}

function UserPic({userHeaderInfo}){
    return (
        <div className={css.userPic}>
            <img src={userHeaderInfo.profileBackgroundImageUrl} width={100} height={100}></img>
            <img className={css.profileBorder} src={userHeaderInfo.profileBorderImageUrl} width={120} height={120}></img>
            <p className={css.level} title="레벨">{userHeaderInfo.level}</p>
        </div>        
    )
}

function UserInfo({userHeaderInfo}){
    return (
        <div className={css.userInfo}>
            <div className={css.userId}>
                {userHeaderInfo.username}
            </div>
            <div className={css.userLadderInfo}>
                레더 랭킹 <strong className={css.userRanking}>{Number(userHeaderInfo.ladderRank).toLocaleString()}</strong>
                위 (상위 {userHeaderInfo.rankPercentage}%)
            </div>
        </div>          
    )
}