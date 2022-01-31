import css from './UserDetailGameInfo.module.scss'
import {useState, useRef, useEffect} from 'react'
import {matchHistoryDetailInfoAtom} from '../../recoil/summonerInfo'
import { useRecoilState } from 'recoil'

const l = console.log
const booleanToWinOrLoseMapper = {
    true : '승리',
    false : '패배',
}
const MultiKillNameEngToKorMapper = {
    'Double Kill' : '더블킬',
    'Triple Kill' : '트리플킬',
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

const ICON_URL = { 
    BUILD_RED : "//opgg-static.akamaized.net/css3/sprite/images/icon-buildred-p.png",
    BUILD_BLUE : `https://opgg-static.akamaized.net/css3/sprite/images/icon-buildblue-p.png`,
    WARD_BLUE : `https://opgg-static.akamaized.net/css3/sprite/images/icon-buildblue-p.png`,
    WARD_RED : `https://opgg-static.akamaized.net/css3/sprite/images/icon-buildred-p.png`,     
    BTN_WIN : "/detail_btn_for_win.png",
    BTN_LOSE : "/detail_btn_for_lose.png",
}
const ITEM_INFO_URL = 'http://ddragon.leagueoflegends.com/cdn/10.15.1/data/ko_KR/item.json'


export default function UserDetailGameInfo({matchHistoryDetailInfo}) {

    // const [matchHistoryDetailInfo, setMatchHistoryDetailInfo]  = useRecoilState(matchHistoryDetailInfoAtom)
    const itemToolTipWrapperRef = useRef(null)
    const [itemsInfo, setItemsInfo] = useState()

    useEffect(() => {
        requestItemsInfo()
    }, [])

    const requestItemsInfo = async () => {
        const dbRes = await fetch(ITEM_INFO_URL)
                .then(r=>r.json())
        setItemsInfo(_ => dbRes.data)
    }

    const calculatePassedTime = (v) => {

        const now = new Date()
        const gameDate = new Date(v.createDate * 1000) 
        const diffTime = Math.abs(now - gameDate);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60)); 
        const diffDays =  Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        
        if(diffDays < 1) {
            return diffHours + '시간 전'
        } else {
            return diffHours + '일 전'
        }
    }

    const calculatePlayaTime = (v) => {

        const gamePlayMinutes =  (v.gameLength / 60) | 0
        const gamePlaySeconds =  (v.gameLength % 60)
        const gamePlayHour    =  (gamePlayMinutes / 60) | 0
        return {gamePlaySeconds, gamePlayMinutes, gamePlayHour}
    }

    const showItemToolTip = e => {

        itemToolTipWrapperRef.current.style.display = 'block'
        const itemElem = e.currentTarget
        const itemNumber = itemElem.attributes.itemnumber.value
        const itemInfo = itemsInfo[itemNumber]
        const itemName = itemInfo.name
        const itemDescription = itemInfo.description
        const basePrice = itemInfo.gold.base
        const sellPrice = itemInfo.gold.sell

        const itemHTML =  `
            <div class="${css.itemToolTipUpperSide} itemToolTip" 
                style="top : 0px">
                <b style="color: #00cfbc">${itemName}</b>
                <br/>
                ${itemDescription}
                <br/>
                <br/>
                가격: 
                <span style="color: #ffc659">${basePrice} (${sellPrice})</span>
            </div>                 
        `

        itemToolTipWrapperRef.current.innerHTML = itemHTML
        const itemToolTipElem = document.querySelector('.itemToolTip')

        // POSITIONING
        if(e.clientY < itemToolTipElem.getBoundingClientRect().height + 200) {
            const newY = itemElem.offsetTop + itemElem.getBoundingClientRect().height + 10
            itemToolTipElem.style.top = newY + 'px'

            const newX = itemElem.offsetLeft - (itemToolTipElem.getBoundingClientRect().width / 2)
            itemToolTipElem.style.left = newX + 'px'

            itemToolTipElem.classList.remove(css.itemToolTipUpperSide)         
            itemToolTipElem.classList.add(css.itemToolTipBottomSide)

        } else {
            // POSITIONING
            const newY = itemElem.offsetTop - itemToolTipElem.getBoundingClientRect().height - 13
            itemToolTipElem.style.top = newY + 'px'
    
            const newX = itemElem.offsetLeft - (itemToolTipElem.getBoundingClientRect().width / 2)
            itemToolTipElem.style.left = newX + 'px'    
        }
    }

    const hideItemToolTip = e => {
        itemToolTipWrapperRef.current.style.display = 'none'
    }

    return (
        <>
            {matchHistoryDetailInfo && (
                <div className={css.wrapper}>
                    {matchHistoryDetailInfo.games.map((matchInfo,matchInfoIdx)=> {

                        const peakList = matchInfo.peak
                        const passedTime = calculatePassedTime(matchInfo)
                        const {gamePlaySeconds, gamePlayMinutes, gamePlayHour} = calculatePlayaTime(matchInfo)                        
                        const championEngName = championNameEngToKor[
                                                                     matchInfo.champion.imageUrl.split('/').slice(-1)[0].split('.')[0]
                                                                    ] 
                        const kill = matchInfo.stats.general.kill
                        const death = matchInfo.stats.general.death
                        const assist = matchInfo.stats.general.assist 
                        const kda = death === 0 ? 
                                (kill + assist) * 1.2 :
                                ((kill + assist) / death).toFixed(2)
                        const largestMultiKill = matchInfo.stats.general.largestMultiKillString
                        const opScoreBadge = matchInfo.stats.general.opScoreBadge
                        const cs = matchInfo.stats.general.cs
                        const csPerMin = matchInfo.stats.general.csPerMin
                        const contributionForKillRate = matchInfo.stats.general.contributionForKillRate
                        const visionWardsBought = matchInfo.stats.ward.visionWardsBought
                        const blankItemNumber = 7 -matchInfo.items.length
                        const CSSbattleResultType = matchInfo.isWin ? css.typeWin : css.typeLose 
                        const CSSStatsBtn = matchInfo.isWin ? css.statsBtnWin : css.statsBtnLose
                        const isWin = booleanToWinOrLoseMapper[matchInfo.isWin]
                        const multiKillNameKor = MultiKillNameEngToKorMapper[largestMultiKill]

                        return (
                            <div className={css.detailGameInfo + ' ' + CSSbattleResultType } key={matchInfoIdx}>
                                <GameStats matchInfo={matchInfo} isWin={isWin} gamePlayMinutes={gamePlayMinutes} gamePlaySeconds={gamePlaySeconds} passedTime={passedTime}  />
                                <GameSettingInfo matchInfo={matchInfo} championEngName={championEngName} />
                                <KDA kill={kill} death={death} assist={assist} kda={kda} largestMultiKill={largestMultiKill} multiKillNameKor={multiKillNameKor} opScoreBadge={opScoreBadge} />           
                                <Stats matchInfo={matchInfo} cs={cs} csPerMin={csPerMin} contributionForKillRate={contributionForKillRate} />
                                <Items matchInfo={matchInfo} showItemToolTip={showItemToolTip} hideItemToolTip={hideItemToolTip} blankItemNumber={blankItemNumber} isWin={isWin} visionWardsBought={visionWardsBought} />                                    
                                <FollowPlayers matchInfo={matchInfo} />                                
                                
                                <div className={CSSStatsBtn}>                                    
                                    <img className={css.statBtnImg} 
                                            src={matchInfo.isWin ? ICON_URL.BTN_WIN : ICON_URL.BTN_LOSE}></img>
                                </div>                             
                            </div>
                        )
                    })}
                </div>
            )}
            <div className={css.itemToolTipWrapper} ref={itemToolTipWrapperRef}>
            </div>
            <div className='itemToolTipWrapper'></div>
        </>
    )
}


function GameStats({matchInfo, isWin, gamePlayMinutes, gamePlaySeconds, passedTime}){
    return (
        <div className={css.gameStats}>
            <div className={css.gameStatsUpper}>
                <div className={css.gameType}>{matchInfo.gameType}</div>
                <div>{passedTime}</div>
            </div> 
            <div className={css.isWinWrapper}>
                <div className={isWin === '승리' ? css.win : css.lose}>
                    {isWin}
                </div>
                <div>{gamePlayMinutes}분 {gamePlaySeconds}초</div>
            </div>
        </div>
    )
}

function GameSettingInfo({matchInfo, championEngName}){
    return (
        <div className={css.gameSettingInfoWrapper}>
            <div className={css.gameSettingInfo}>
                <div>
                    <img className={css.championImg} src={matchInfo.champion.imageUrl}></img>
                </div>
                <div>
                    {matchInfo.spells.map((spell,spellIdx)=> {
                        return (
                            <div key={spellIdx}>
                                <img className={css.spellImg} src={spell.imageUrl}></img>
                            </div>
                        )
                    })}                                    
                </div>
                <div>
                    {matchInfo.peak.map((peak, peakIdx)=> {
                        return (
                            <div key={peakIdx}>
                                <img className={css.spellImg} src={peak}></img>                                                    
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={css.championEngName}>{championEngName}</div>
        </div>   
    )
}

function KDA({kill, death, assist, kda, largestMultiKill, multiKillNameKor, opScoreBadge}){
    return ( 
        <div className={css.kdaWrapper}>
            <div className={css.kda}>
                <span className={css.kill}>{kill}</span>
                <span className={css.death}>{death}</span>
                <span className={css.assist}>{assist}</span>                                            
            </div>
            <div className={css.kdaCalculate}>
                <span className={css.kda}>{kda}</span>
                <span>:1 평점</span>                                        
            </div>       
            <div className={css.badge}>
                {largestMultiKill && (
                    <div className={css.multiKillBadge}>
                        {multiKillNameKor}
                    </div>
                )}
                {opScoreBadge && (
                    <div className={css.aceBadge}>
                        {opScoreBadge}
                    </div>
                )}
            </div>    
        </div>       
    )
}

function Items({matchInfo, showItemToolTip, hideItemToolTip,blankItemNumber,isWin,visionWardsBought}){
    return (
        <div className={css.itemsWrapper}>
            <div className={css.items}>
                {matchInfo.items.map((item,itemIdx)=> {
                    const itemNumber = item.imageUrl.split('/').slice(-1)[0].split('.png')[0]
                    return (
                        <div className={css.item} 
                            key={itemIdx} 
                            onMouseEnter={showItemToolTip} 
                            onMouseLeave={hideItemToolTip} 
                            itemnumber={itemNumber}>
                            <img className={css.itemImg} src={item.imageUrl}></img>
                        </div>
                    )   
                })}
                {
                    [...Array(blankItemNumber)].map((blankItem, blankItemIdx)=> {
                        return (
                            <div key={blankItemIdx}>
                                <img  className={css.itemImg} src="/item_blank_icon.png"></img>                                                    
                            </div>
                        )
                    })
                }
                <img className={css.itemImg} src={isWin === '승리' ? ICON_URL.BUILD_BLUE : ICON_URL.BUILD_RED}></img>
            </div>
            <div className={css.visionWardWrapper}>
                <img className={css.wardImg} src={isWin === '승리' ? ICON_URL.WARD_BLUE : ICON_URL.WARD_RED}></img> 
                제어 와드 {visionWardsBought}
            </div>
        </div>             
    )
}

function FollowPlayers({matchInfo, }){
    return (
        <div className={css.followPlayers}>
            <div>
                {matchInfo.detailInfos.red.players.map((player, playerIdx) => {
                    const playerName = player.summonerName.replace(/[\\+]/g,'')
                    const playerNameMod = playerName.length > 5 ? playerName.substring(0,5) + '...' :  playerName
                    return (
                        <div className={css.teamMemberWrapper} key={playerIdx}>
                            <div>
                                <img className={css.teamMemberImg} src={player.champion.imageUrl}></img>
                            </div>                                                    
                            <div className={css.teamMemberName}>{playerName}</div>
                        </div>
                    )
                })}
            </div>
            <div >
                {matchInfo.detailInfos.blue.players.map((player, playerIdx) => {
                    const playerName = player.summonerName.replace(/[\\+]/g,'')
                    return (
                        <div className={css.teamMemberWrapper} key={playerIdx}>
                            <div >
                                <img className={css.teamMemberImg} src={player.champion.imageUrl}></img>
                            </div>                                                    
                            <div className={css.teamMemberName}>{playerName}</div>
                        </div>
                    )
                })}
            </div>
        </div>          
    )
}

function Stats({matchInfo, cs, csPerMin, contributionForKillRate}){
    return (
        <div className={css.statsWrapper}>
            <div>레벨{matchInfo.champion.level}</div>
            <div>{cs} ({csPerMin}) CS</div>
            <div className={css.killInvolvement}>
                킬관여 {contributionForKillRate}
            </div>
        </div>       
    )
}