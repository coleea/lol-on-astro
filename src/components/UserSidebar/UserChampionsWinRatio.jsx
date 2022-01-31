import css from './UserChampionsWinRatio.module.scss'
import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import {userSidebarInfoAtom}  from '../../recoil/summonerInfo'

const l = console.log
const viewTypes = {
    general : 'general',
    _7days : '7days'
}

export default function UserMain({}) {

    const [viewtype, setviewtype] = useState('general')

    const [userSidebarInfo, setUserSidebarInfo]  = useRecoilState(userSidebarInfoAtom)
    const winRatioFreeSeason = getSortedChampions(userSidebarInfo?.winRatioFreeSeason)
    const winRatio7Days      = getSortedChampions(userSidebarInfo?.winRatio7Days) 

    const toggleviewtype = e => {
        const viewtype = e.target.attributes.viewtype.value
        setviewtype(viewtype)          
    }

    return (
        <>
            <WinRatioToggleBar toggleviewtype={toggleviewtype} viewtype={viewtype} />
            {userSidebarInfo && (
                <>
                    <div className={css.wrapper}>
                        {viewtype === viewTypes.general && 
                            winRatioFreeSeason && 
                            winRatioFreeSeason.map((matchInfos,matchInfosIdx)=> 
                                <ChampionWinRate matchInfos={matchInfos} matchInfosIdx={matchInfosIdx} />
                            )
                        }
                        {viewtype === viewTypes._7days && 
                            winRatio7Days.map((matchInfos,matchInfosIdx)=> 
                                <_7daysWinRate matchInfos={matchInfos} matchInfosIdx={matchInfosIdx} />
                            )
                        }
                    </div>             
                </>
            )}
        </>
    )
}

function WinRatioToggleBar({toggleviewtype, viewtype}){
    let cssChampionWinRaio = (viewtype === viewTypes.general) ? 
                                css.winRatioType + ' ' + css.itemActive :
                                css.winRatioType 

    let css7Days = (viewtype === viewTypes._7days) ? 
                                css.winRatioType + ' ' + css.itemActive :
                                css.winRatioType ;

    return (
        <div className={css.winRatioOption}>
            <div className={cssChampionWinRaio} 
                onClick={toggleviewtype} viewtype='general'>
                챔피언 승률
            </div>
            <div className={css7Days} 
                onClick={toggleviewtype} viewtype='7days'>
                7일간 랭크 승률
            </div>
        </div>
    )
}

function ChampionWinRate({matchInfos, matchInfosIdx}){
    
    const totalGamesPlayed = matchInfos.wins  + matchInfos.losses
    const winRatio =  (matchInfos.wins / totalGamesPlayed * 100) | 0
    const kda = ((matchInfos.kills + matchInfos.assists) / matchInfos.deaths).toFixed(2)
    const cssKda =  (kda > 5) ? css.upperContents + ' ' + css.kdaGreatest  
                                 : (kda > 3.5) ? 
                                                css.upperContents + ' ' + css.kdaGreat 
                                                : css.upperContents ;

    return (        
        <div className={css.championWinRateWrapper} key={matchInfosIdx}>
            <div className={css.championImgWrapper}>
                    <img alt={`${matchInfos.name}의 이미지`} className={css.championImg} src={matchInfos.imageUrl}></img>
            </div>
            <div>
                    <p className={css.upperContents + ' ' + css.championName}>{matchInfos.name}</p>
                    <p className={css.bottomContents}>CS {matchInfos.cs} (X)</p>
            </div>
            <div>
                    <p className={cssKda}>{kda} : 1 평점</p>
                    <p className={css.bottomContents}>{matchInfos.kills} / {matchInfos.assists} / {matchInfos.deaths}</p>
            </div>
            <div className={css._4thBlock}>
                    <p className={`${css.upperContents} ${winRatio > 70 ? css.winRatioForSpecial : " "}`}>{winRatio}%</p>
                    <p className={css.bottomContents}>{totalGamesPlayed}게임</p>
            </div>                             
        </div>
    )
}

function _7daysWinRate({matchInfos, matchInfosIdx}){
    const totalBattles = matchInfos.losses + matchInfos.wins
    const winRatio = (matchInfos.wins / totalBattles * 100).toFixed(0)
    const loseRatio = (matchInfos.losses / totalBattles * 100).toFixed(0)
    
    return (
        <div className={css.champion7DaysWinRateWrapper} key={matchInfosIdx}>                                    
            <div className={css.championImgWrapper}>
                <img alt={`${matchInfos.name}의 이미지`} className={css.championImg} src={matchInfos.imageUrl}></img>
            </div>
            <div className={css.name}>
                {matchInfos.name}
            </div>
            <div className={css.winRatio}>
                {winRatio}%
            </div>
            <div className={css.winRatioBar}>
                <div className={css.winBar} style={{flexBasis : `${winRatio}%`}}>
                    <div className={css.winCount}>
                        {matchInfos.wins}승
                    </div>
                </div>
                <div  className={css.loseBar} style={{flexBasis : `${loseRatio}%`}}>
                    <div className={css.loseCount}>                    
                        {matchInfos.losses}패
                    </div>
                </div>
            </div>
        </div>
    )
}


function getSortedChampions(winRatioARr) {

    if(winRatioARr){
        const winRatioFreeSeasonClone = [...winRatioARr]
        winRatioFreeSeasonClone.sort((a,b)=> { return (b.wins  + b.losses) - (a.wins  + a.losses)  })
        return winRatioFreeSeasonClone

    } else {
        return winRatioARr
    }
}
