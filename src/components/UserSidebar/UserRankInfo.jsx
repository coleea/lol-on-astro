import {useState, useEffect}  from 'react'
import { useRecoilState } from 'recoil'
import {userSidebarInfoAtom}  from '../../recoil/summonerInfo'
import css from './UserRankInfo.module.scss'

const l = console.log 

const matchTypeNames = {
   solo : '솔로',
   _5on5 : '자유 5:5', 
}

export default function UserMain() {

    const [userSidebarInfo, setUserSidebarInfo]  = useRecoilState(userSidebarInfoAtom)
    
    return (
        <>
            <div className={css.wrapper}>
                {userSidebarInfo && Object.values(matchTypeNames).map((matchTypeName,i)=> {

                    const rankType = matchTypeName === matchTypeNames.solo ?  
                                                                        userSidebarInfo.solRank 
                                                                      : userSidebarInfo._5on5Rank ;
                    const tierRank          = rankType.tierRank.shortString.replace(/[^0-9]/g, '')
                    const lp                = rankType.tierRank.string.split('(')[1].split(')')[0]
                    const totalMatchCount   = rankType.wins + rankType.losses
                    const winRatio          = (rankType.wins / totalMatchCount * 100).toFixed(0) + '%'

                    return (
                            <div className={matchTypeName === matchTypeNames.solo ? 
                                                                                css.solRankInfo 
                                                                              : css._5on5RankInfo}>
                                <div className={css.tierRank}>
                                    <img alt="tierRank" src={rankType.tierRank.imageUrl}></img>
                                </div>
                                <div className={css.userInfo}>
                                    <div>{matchTypeName} 랭크</div>
                                    <div>정보없음</div>
                                    <div className={css.tierRank}>{rankType.tierRank.tier} {tierRank}</div>
                                    <div className={css.lpAndWinLose}>
                                        <div className={css.lp}>{lp} </div>
                                        <div> 
                                            / {rankType.wins}승 {rankType.losses}패                                         
                                        </div>                               
                                    </div>
                                    <div className={css.winRatioWrapper}>
                                        <div  className={(Number(winRatio) > 70) ? 
                                                    css.winRatioForSpecial 
                                                    :css.winRatio}>
                                                    승률 {winRatio}
                                        </div>                            
                                    </div>
                                </div>
                            </div>                                      
                    )
                })}             
            </div>
        </>
    )
}