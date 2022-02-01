import css from './UserMain.module.scss'
import UserGameSummary from './UserMain/UserGameSummary.jsx'
import UserDetailGameInfo from './UserMain/UserDetailGameInfo.jsx'
import { useEffect, useState } from 'react'
import {useRecoilState} from 'recoil'
import {latest20SummaryInfoAtom, matchHistoryDetailInfoAtom} from '../recoil/summonerInfo'

const l = console.log 

const positionIdxToStrMapper = {
    0:'탑',
    1:'정글',
    2:'미드',
    3:'원딜',
    4:'서포터'
}

const championNameEngToKor = {
    Lucian : `루시안`,
    Qiyana: `키아나`,
    Malzahar: `말자하`,
    Galio :`갈리오`,
    Jayce :`제이스`,
    Anivia :`애니비아`,
    Tristana: `트리스티나`,
    Viktor: `빅토리`,
}

export default function UserMain() {

    const [currentGameType, setCurrentGameType] = useState('all')

    const [latest20SummaryInfo, setLatest20SummaryInfo]         = useRecoilState(latest20SummaryInfoAtom)
    const [currentSummary, setCurrentSummary]                   = useState()

    const [matchHistoryDetailInfo, setMatchHistoryDetailInfo]   = useRecoilState(matchHistoryDetailInfoAtom)
    const [currentMatchHistoryInfo, setCurrentMatchHistoryInfo] = useState(matchHistoryDetailInfo)

    useEffect(()=>{
        (currentGameType === 'all') && 
            setCurrentSummary(latest20SummaryInfo)                                     
    }, [latest20SummaryInfo])

    useEffect(() => {
        (currentGameType === 'all') && 
            setCurrentMatchHistoryInfo(matchHistoryDetailInfo)                                     
    }, [matchHistoryDetailInfo]);
    
    useEffect(() => {
        const filteredMatchDetail = filterGameDetailInfo()         
        if(currentGameType !== 'all') {
            const userSummary = 
                     filterGameSummaryInfo({filteredMatchDetail, matchHistoryDetailInfo})            
            setCurrentSummary(userSummary)
        } else {
            setCurrentSummary(latest20SummaryInfo)
        }
    }, [currentGameType]);
    

    function addChampionToUserSummary({gameInfo, currentUserSummary}){

        const championEngName = gameInfo.champion.imageUrl.split('/').slice(-1)[0].split('.')[0]
            
        let championObj
        for (const champion of currentUserSummary.champions) {
            if(champion.key === championEngName){
                championObj = champion
            }
        }

        if(! championObj){
            championObj = {
                id : 0,
                key : '',
                name : '',
                imageUrl : '',
                games : 0,
                kills : 0,
                deaths : 0,
                assists : 0,
                wins : 0,
                losses : 0,
            }    
            currentUserSummary.champions.push(championObj)
        }
    
        championObj.games++;
        gameInfo.isWin ? championObj.wins++ 
                       : championObj.losses++
        championObj.winRatio = (championObj.wins / championObj.games * 100).toFixed(0) + '%'

        championObj.kills   += gameInfo.stats.general.kill
        championObj.deaths  += gameInfo.stats.general.death
        championObj.assists += gameInfo.stats.general.assist
        championObj.kda     =  championObj.deaths === 0 ? 
                                        (championObj.kills + championObj.assists) * 1.2 
                                      : (championObj.kills + championObj.assists) / championObj.deaths

        championObj.key = championEngName ;
        championObj.name = championNameEngToKor[championEngName];
        championObj.imageUrl = gameInfo.champion.imageUrl
        return currentUserSummary        
    }
        
    function filterGameSummaryInfo({filteredMatchDetail, matchHistoryDetailInfo}){        

        const initializedUserSummary = {
            totalMatch : 0,            
            wins: 0, 
            losses : 0,
            kills : 0,
            assists : 0,
            deaths : 0,
            kda : null,
            champions : [],
            positions: [],
            favoritePositionCounter : {
                '탑' : {games : 0, wins : 0, losses : 0, winRatio : 0, position :'TOP', positionName : 'Top'},
                '정글' : {games : 0, wins : 0, losses : 0, winRatio : 0, position :'JNG', positionName : 'Jungle'},
                '미드' : {games : 0, wins : 0, losses : 0, winRatio : 0, position :'MID', positionName : 'Middle'},
                '원딜' : {games : 0, wins : 0, losses : 0, winRatio : 0,  position :'ADC', positionName : 'Bottom'},
                '서포터' : {games : 0, wins : 0, losses : 0, winRatio : 0,  position :'SUP', positionName : 'Support'},
            }
        }        
        
        const userSummary = filteredMatchDetail?.games.reduce((currentUserSummary, detailInfo) => {

            const gameInfo = {...detailInfo}
            currentUserSummary.totalMatch++;
            gameInfo.isWin ? currentUserSummary.wins++ : currentUserSummary.losses++         
            gameInfo.winRatio = (currentUserSummary.wins / currentUserSummary.totalMatch * 100).toFixed(0) + '%'
            currentUserSummary.kills   += gameInfo.stats.general.kill
            currentUserSummary.deaths  += gameInfo.stats.general.death
            currentUserSummary.assists += gameInfo.stats.general.assist
            currentUserSummary.kda =  currentUserSummary.deaths === 0 ? 
                                        ((currentUserSummary.kills + currentUserSummary.assists) * 1.2 )
                                        : ((currentUserSummary.kills + currentUserSummary.assists) / currentUserSummary.deaths)

            // const championEngName = gameInfo.champion.imageUrl.split('/').slice(-1)[0].split('.')[0]

            currentUserSummary = addChampionToUserSummary({gameInfo : {...gameInfo}, 
                                                            currentUserSummary : {...currentUserSummary}, 
                                                            }) 

            currentUserSummary = addFavoritePositionToUserSummary({gameInfo : {...gameInfo}, 
                                                                    filteredMatchDetail : {...filteredMatchDetail}, 
                                                                    currentUserSummary : {...currentUserSummary}})
            return currentUserSummary 
        }, initializedUserSummary) 
        
        const userSummaryModified1 = filterNotPlayedPosition({userSummary : {...userSummary}})
        const userSummaryModified2 = sortChampions({userSummary : {...userSummaryModified1}})
        return userSummaryModified2
    }

    function filterNotPlayedPosition({userSummary}){
        const positionInfos = Object.entries(userSummary.favoritePositionCounter)
                                      .sort(([, a], [, b]) => b.totalMatch - a.totalMatch)

        for (const positionInfo of positionInfos) {
            if(positionInfo[1].games > 0){
                userSummary.positions.push({
                    ...positionInfo[1]
                })        
            }
        }        
        return userSummary
    }

    function addFavoritePositionToUserSummary({gameInfo, filteredMatchDetail, currentUserSummary}){

        const targetGameId = gameInfo.gameId
        const username = filteredMatchDetail.games[0].summonerName

        const gameIdx = filteredMatchDetail.games
                                                .reduce((acc, v, idx) => 
                                                    targetGameId === v.gameId ? idx : acc
                                                , -1)
        
        let userPositionIdx = filteredMatchDetail.games[gameIdx].detailInfos.blue.players
                                                                    .reduce((acc,v,idx)=> 
                                                                        v.summonerName === username ? idx : acc
                                                                    , null)

        if(userPositionIdx == null){
            userPositionIdx = filteredMatchDetail.games[gameIdx].detailInfos.red.players
                                                                    .reduce((acc,v,idx)=> 
                                                                        v.summonerName === username ? idx : acc
                                                                    , null)                        
        }
     
        const userPositionStr = positionIdxToStrMapper[userPositionIdx]
        const gamePosition = currentUserSummary.favoritePositionCounter[userPositionStr]
        gamePosition.games++
        gameInfo.isWin ? gamePosition.wins++ : gamePosition.losses++         
        gamePosition.winRatio = (gamePosition.wins / gamePosition.games * 100).toFixed(0) + '%'        
        return currentUserSummary
    }

    function sortChampions({userSummary}){
        userSummary.champions.sort((a,b)=> b.games - a.games)
        userSummary.champions = userSummary.champions.slice(0,3)        
        return userSummary
    }

    function filterGameDetailInfo(){
        let filteredMatchDetail
        switch (currentGameType) {
            case 'all':
                setCurrentMatchHistoryInfo(matchHistoryDetailInfo)
                return matchHistoryDetailInfo
                break
            case 'solo':
                filteredMatchDetail = {
                    games : matchHistoryDetailInfo.games.filter( (v,_) => v.gameType === '솔랭' )
                }
                setCurrentMatchHistoryInfo(filteredMatchDetail)
                return filteredMatchDetail
                break
            case 'free':   
                filteredMatchDetail = {
                    games : matchHistoryDetailInfo.games.filter( (v,_) => v.gameType === '자유 5:5 랭크' )
                }             
                setCurrentMatchHistoryInfo(filteredMatchDetail)
                return filteredMatchDetail
                break        
            default :
                break
        }        
    }

    const toogleGameType = e => {
        const gametype = e.target.attributes.type.value
        setCurrentGameType(gametype)
    }

    return (
        <>
            <div className={css.wrapper}>
                <div className={css.gameCategory}>
                    <div className={currentGameType === 'all' ? 
                                                            `${css.CategoryAll} ${css.focusdMenu}` 
                                                            : css.CategoryAll } 
                                                            onClick={toogleGameType} type="all">전체</div>
                    <div className={currentGameType === 'solo' ? 
                                                            `${css.CategorySolo} ${css.focusdMenu}` 
                                                            : css.CategorySolo } 
                                                            onClick={toogleGameType} type="solo">솔로게임</div>
                    <div className={currentGameType === 'free' ? 
                                                            `${css.CategoryFree} ${css.focusdMenu}` 
                                                            : css.CategoryFree  } 
                                                            onClick={toogleGameType} type="free">자유랭크</div>
                </div>
                <UserGameSummary currentGameType={currentGameType} latest20SummaryInfo={currentSummary} />
                <UserDetailGameInfo matchHistoryDetailInfo={currentMatchHistoryInfo} />
            </div>
        </>
    )
}