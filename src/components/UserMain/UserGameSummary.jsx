import { useRecoilState } from 'recoil'
import css from './UserGameSummary.module.scss'
import { latest20SummaryInfoAtom } from '../../recoil/summonerInfo'
import { useEffect, useState } from 'react'
import * as d3 from 'd3';

const l = console.log 

const positionNameEngToKorMapper = {
    'Top' : '탑',
    'Middle' : '미드',
    'Jungle' : '정글',
    'Bottom' : '원딜',
    'Support' : '서포터',
}

const positionImgUrlMapper = {
    'Top' : '/top_icon.png',
    'Middle' : '/mid_icon.png',
    'Jungle' : '/jungle_icon.png',
    'Bottom' : '/onedeal_icon.png',
    'Support' : '/supporter_icon.png',
}

export default function UserMain({latest20SummaryInfo}) {

    // const [latest20SummaryInfo, setLatest20SummaryInfo]  = useRecoilState(latest20SummaryInfoAtom)
    const [emptyChampionCount, setEmptyChampionCount] = useState(0)
    const winRatio = latest20SummaryInfo && latest20SummaryInfo.wins / latest20SummaryInfo.totalMatch * 100
    const kda = latest20SummaryInfo && latest20SummaryInfo.kda
    const cssKdaRank = kda >= 5 ? css.kda_over5 
                                : kda >= 4 ? css.kda_over4
                                    : kda >= 3 ? css.kda_over3
                                        : css.kdaNm
    const winRate = latest20SummaryInfo && (latest20SummaryInfo.wins / latest20SummaryInfo.totalMatch * 100).toFixed(0) + '%' 

    useEffect(() => {    
        if(latest20SummaryInfo){            
            drawWinRatioCircle(latest20SummaryInfo)
            const emptyChampionCount = 3 - latest20SummaryInfo.champions.length
            setEmptyChampionCount(emptyChampionCount)
        }
    }, [latest20SummaryInfo])

    function drawWinRatioCircle(latest20SummaryInfo){    

        document.querySelector('.forDrawing').innerHTML = ''
        
        const color = d3.scaleOrdinal()
                        .range(['#ee5a52', '#1f8ecd'])

        const pie = d3.pie()
                        .value((d) => d)  

        var svg = d3.select(".forDrawing")    
                    .append("svg")
                    .attr("width", 90)
                    .attr("height", 90)
  
        const group = svg.append('g')
                          .attr('transform', 'translate(45, 45)')
  
        const arc = d3.arc()
                        .innerRadius(33)
                        .outerRadius(45)
                
        const winRatio = latest20SummaryInfo.wins / latest20SummaryInfo.totalMatch * 100
        let loseRatio = latest20SummaryInfo.losses / latest20SummaryInfo.totalMatch * 100

        // 버그 회피용. 두 값이 같으면 제대로 그려지지 않음
        if(winRatio === loseRatio) {
            loseRatio += 0.000001
        }

        const arcs = group.selectAll('arc')
                            .data(pie([winRatio,loseRatio]))
                            .enter()
                            .append('g')
                            .attr('class', 'arc')
                    
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data))
    }

    return (
        <>
            {latest20SummaryInfo && (
                <div className={css.wrapper}>
                    <div className={css.gameSummary}>
                        <WinLoseStats latest20SummaryInfo={latest20SummaryInfo} winRate={winRate} />
                        <KDA latest20SummaryInfo={latest20SummaryInfo} cssKdaRank={cssKdaRank} winRatio={winRatio} />                      
                        <ChampionInfos latest20SummaryInfo={latest20SummaryInfo} emptyChampionCount={emptyChampionCount} />
                        <FavoritePosition latest20SummaryInfo={latest20SummaryInfo} />
                    </div>
                </div>
            )}       
        </>
    )
} 

function WinLoseStats({latest20SummaryInfo, winRate}){
    return (
        <div className={css.winLoseStats}>
            <div>
                <div className={css.battleRecord}>
                    {latest20SummaryInfo.totalMatch}전 {latest20SummaryInfo.wins}승 {latest20SummaryInfo.losses}패                                
                </div>
                <div className='forDrawing'>
                </div>
                <div className={css.winRate}>
                    {winRate}
                </div>
            </div>
        </div>        
    )
}

function KDA({latest20SummaryInfo , cssKdaRank, winRatio}) {
    return (
        <div className={css.kda}>
            <div className={css.kdaInnerWrapper}>
                <div  className={css.kdaUpperInfo}>                                
                    <div className={css.kdaUpperInfoUnit + ' ' + css.kdaUpperInfoUnitFirst}>
                        {latest20SummaryInfo.kills}
                    </div>
                    <div className={css.kdaUpperInfoUnit + ' ' + css.kdaUpperInfoUnitCenter}>
                        {latest20SummaryInfo.assists}
                    </div>
                    <div className={css.kdaUpperInfoUnit + ' ' + css.kdaUpperInfoUnitLast}>
                        {latest20SummaryInfo.deaths}
                    </div>                                                                                                 
                </div>                            
                <div className={css.kdaBottomInfo}>                            
                    <div className={cssKdaRank}>
                        {latest20SummaryInfo.kda.toFixed(2)} : 1 
                    </div>
                    <div className={winRatio > 60 ? css.winRatioSpecial : css.winRatioNm}>
                        {` (${winRatio.toFixed(0)}%)`}
                    </div>
                </div>  
            </div>
        </div>        
    )
}

function FavoritePosition({latest20SummaryInfo}) {
    return (
    <div className={css.favoritePosition}>
        <div className={css.favoritePositionTitle}>
            선호 포지션 (랭크)
        </div>
        {latest20SummaryInfo.positions.map((position,positionIdx)=> {

            const positionNameKor = positionNameEngToKorMapper[position.positionName]
            const positionImgUrl = positionImgUrlMapper[position.positionName]
            const roleRate= (position.games / latest20SummaryInfo.totalMatch * 100).toFixed(0)
            const winRate = (position.wins / (position.wins + position.losses) * 100).toFixed(0)

            return (
                <div className={css.positionInfoWrapper} key={positionIdx}>
                    <div>
                        <img alt={`${positionNameKor}의 포지션 로고`} 
                                className={css.positionImg} src={positionImgUrl}></img>                                        
                    </div>
                    <div className={css.positionInfoDetail}>
                        <div className={css.positionName}>{positionNameKor}</div> 
                        <div className={css.PositionStatContent}>
                            <div className={css.roleRate}>{roleRate}%</div>
                            <div className={css.positionWinRatioWrapper}>
                                <div>승률</div>
                                <div className={css.positionWinRate}>{winRate} %</div>  
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>
    )
}

function ChampionInfos({latest20SummaryInfo, emptyChampionCount,}) {
    return (
    <div className={css.favoriteChampions}>
        {latest20SummaryInfo.champions.map((v,i)=> {
            const winRatio = v.wins / (v.wins + v.losses) * 100
            const winRatioStr = winRatio.toFixed(0)
            const kdaStr = ((v.kills + v.assists) / v.deaths).toFixed(0)
            const kda = (v.kills + v.assists) / v.deaths
            const cssKDA = kda > 6 ? css.kdaOver6 : css.kdaNm
            const cssWinRatio = winRatio >= 60 ? css.winRatioGreat : css.winRatioNm



            return (
                <div className={css.championInfoUnit} key={i}>
                    <div >
                        <img className={css.championImg} src={v.imageUrl}></img>                                        
                    </div>
                    <div className={css.infos}>
                        <div className={css.championName}>
                            {v.name}                                            
                        </div>
                        <div className={css.championStatistics}>
                            <div className={cssWinRatio}>{winRatioStr}% </div>
                            <div className={css.winAndLose}>({v.wins}승 {v.losses}패)</div>
                            <div className={cssKDA}>{kdaStr} 평점</div>
                        </div>
                    </div>
                </div>
            )
        })}
        {
            emptyChampionCount > 0 && [...Array(emptyChampionCount)].map((_, i)=> {
                return (
                    <div key={i}>
                        <div className={css.emptyChampionWrapper}>
                            <div className={css.emptyChampionImgWrapper}>
                                <img className={css.emptyChampionImg} src="/emptyChampion.png"></img>
                            </div>
                            <div className={css.emptyChampionDescription}>
                                챔피언 정보가 없습니다.
                            </div>                                                
                        </div>
                    </div>                                        
                )
            })
        }
    </div>          
    )
}