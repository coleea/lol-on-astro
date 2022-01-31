import { getDefaultNormalizer } from '@testing-library/react'
import { useRef, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import {basicInfoAtom, mostInfoAtom, matchesAtom, 
    userHeaderInfoAtom, userSidebarInfoAtom, latest20SummaryInfoAtom, matchHistoryDetailInfoAtom} from '../recoil/summonerInfo'
import css from './Header.module.scss'
import { useParams } from "react-router-dom";

const l = console.log 

const INITIAL_USER_QUERY          = 'Hello User'
const URL_TEMPLATE_BASIC_INFO     = `https://codingtest.op.gg/api/summoner/USERNAME`
const URL_TEMPLATE_MOST_INFO      = `https://codingtest.op.gg/api/summoner/USERNAME/mostInfo`
const URL_TEMPLATE_MATCHES        = `https://codingtest.op.gg/api/summoner/USERNAME/matches`
const URL_TEMPLATE_MATCH_DETAILS  = `https://codingtest.op.gg/api/summoner/USERNAME/matchDetail/`
const URL_BASE_FOR_AUTOCOMPLETE   = 'https://raw.githubusercontent.com/coleea/lol-src/master/api/autocomplete_fake.json'
const URL_FOR_AUTOCOMPLETE_SERVER = import.meta.env.PUBLIC_URL_FOR_AUTOCOMPLETE_SERVER
l('URL_FOR_AUTOCOMPLETE_SERVER', URL_FOR_AUTOCOMPLETE_SERVER)

async function fetchForAutocomplete(username){
    const AUTOCOMPLETE_URL = URL_FOR_AUTOCOMPLETE_SERVER + 'username=' + username
    const res = await fetch(AUTOCOMPLETE_URL).then(r=>r.json())
    const autocompleteEntries = (res.length > 0 ) ?
                                                res[0].groups[0].items : 
                                                []
    return autocompleteEntries
}

export default function Header() {
    l('import.meta.env', import.meta.env.PUBLIC_DB_TYPE)

    const params = useParams()
    const username = params.username

    const [queryHistory, setQueryHistory] = useState(JSON.parse(localStorage.queryHistory || '[]'))
    const [favoriteUsers, setFavoriteUsers] = useState(JSON.parse(localStorage.favoriteUsers || '[]'))
    const [isInputExists, setIsInputExists]  = useState(false)
    const [isSearchbarFocused, setIsSearchbarFocused] = useState(false)
    const [historyViewType, setHistoryViewType] = useState('latestSearch')
    const [autocompleteEntries , setAutocompleteEntries] = useState([])
    
    const searchHistoryWrapperRef = useRef(null)
    const searcBarRef = useRef(null)
    const isSearchHistoryAreaClicked = useRef(false)

    const [basicInfo, setBasicInfo]  = useRecoilState(basicInfoAtom)
    const [mostInfo, setMostInfo]  = useRecoilState(mostInfoAtom)
    const [matches, setMatches]  = useRecoilState(matchesAtom)

    const [userHeaderInfo, setUserHeaderInfo]  = useRecoilState(userHeaderInfoAtom)
    const [userSidebarInfo, setUserSidebarInfo]  = useRecoilState(userSidebarInfoAtom)
    const [latest20SummaryInfo, setLatest20SummaryInfo]  = useRecoilState(latest20SummaryInfoAtom)
    const [matchHistoryDetailInfo, setMatchHistoryDetailInfo]  = useRecoilState(matchHistoryDetailInfoAtom)    

    useEffect(() => {
        l('헤더 호출')
        if(username){
            getDataAndSetState(username) 
            const queryHistoryArrRenewed = saveQueryToDB(username)
            setQueryHistory(queryHistoryArrRenewed)
        } else {
            getDataAndSetState(INITIAL_USER_QUERY)
        }
    }, [])
    
    const requestMatchHistoryDetail = async ({USER_QUERY, matches}) => {

        const matchDetailList = await Promise.all(
            matches.games.map((v, i) => {
                const URL = URL_TEMPLATE_MATCH_DETAILS.replace('USERNAME', USER_QUERY) + v.gameId
                return fetch(URL).then(r => r.json())            
            })
        )        

        const gameDetailInfosById = {}

        for (const obj of matchDetailList) {
            gameDetailInfosById[obj.gameId] = obj.teams
        }

        for (const game of matches.games) {
            const detailInfos = gameDetailInfosById[game.gameId]
            game.detailInfos = {
                red : detailInfos[0],
                blue : detailInfos[1],
            }
        }

        const matchHistoryDetailInfo = {
            games : matches.games,
        }
        return matchHistoryDetailInfo
    }

    async function getDataAndSetState(USER_QUERY) {

        const URL_BASIC_INFO = URL_TEMPLATE_BASIC_INFO.replace('USERNAME', USER_QUERY)
        const URL_MOST_INFO  = URL_TEMPLATE_MOST_INFO .replace('USERNAME', USER_QUERY)
        const URL_MATCHES    = URL_TEMPLATE_MATCHES   .replace('USERNAME', USER_QUERY)

        const [basicInfo, mostInfo, matches] = await Promise.all([
            fetch(URL_BASIC_INFO).then(r => r.json()),
            fetch(URL_MOST_INFO).then(r => r.json()),
            fetch(URL_MATCHES).then(r => r.json()),
        ])        
        
        const userHeaderInfo = {
            username : basicInfo.summoner.name.replace(/[\\+]/g,' '),
            profileImageUrl: basicInfo.summoner.profileImageUrl,
            profileBackgroundImageUrl: basicInfo.summoner.profileBackgroundImageUrl,
            profileBorderImageUrl : basicInfo.summoner.profileBorderImageUrl,
            level : basicInfo.summoner.level,
            ladderRank : basicInfo.summoner.ladderRank.rank,
            rankPercentage : basicInfo.summoner.ladderRank.rankPercentOfTop,
            prevTiers : basicInfo.summoner.previousTiers
        }

        const sidebarInfo = {
            solRank : basicInfo.summoner.leagues[0],
            _5on5Rank : basicInfo.summoner.leagues[1],
            winRatioFreeSeason : mostInfo.champions,
            winRatio7Days : mostInfo.recentWinRate,
        }

        const latest20SummaryInfo = {
            totalMatch :  Number(matches.summary.wins)  + Number(matches.summary.losses) ,
            wins : matches.summary.wins,
            losses : matches.summary.losses,
            kills: matches.summary.kills,
            deaths: matches.summary.deaths,
            assists: matches.summary.assists,
            kda : matches.summary.deaths === 0 ?
                (matches.summary.kills + matches.summary.assists) * 1.2
                : (matches.summary.kills + matches.summary.assists) / matches.summary.deaths,        
            positions : matches.positions,
            champions : matches.champions,
        }

        setUserHeaderInfo(userHeaderInfo)
        setUserSidebarInfo(sidebarInfo)
        setLatest20SummaryInfo(latest20SummaryInfo)
        
        const matchHistoryDetailInfo = await requestMatchHistoryDetail({USER_QUERY, matches})
        setMatchHistoryDetailInfo(matchHistoryDetailInfo)
    }


    const saveQueryToDB = (query) => {

        if(import.meta.env.PUBLIC_DB_TYPE === 'localstorage'){

            const queryHistoryArrFiltered = queryHistory.filter(username => username !== query)                        
            const queryHistoryArrRenewed = [...queryHistoryArrFiltered, query]          
            localStorage.queryHistory = JSON.stringify(queryHistoryArrRenewed)
            return queryHistoryArrRenewed

        } else {
            alert('현재 localstorage를 이용한 db저장만 가능')
        }
    }

    const processUserSearch = e => {

        e.preventDefault()
        const query = Object.fromEntries(
                                new FormData(e.target))
                                    .query

        getDataAndSetState(query)
        const queryHistoryArrRenewed = saveQueryToDB(query)
        setQueryHistory(queryHistoryArrRenewed)
    }

    const isCharInput = e => e.key !== 'enter'    

    const doKeyInputCallback = async e => {

        if(isCharInput(e)) {
            const query = e.target.value
            query.length > 0 ? setIsInputExists(true)
                                : setIsInputExists(false)

            if(query.length > 0) {
                const autocompleteEntries = await tryCacheForAutocomplete(query)                
                setAutocompleteEntries(autocompleteEntries)                
            }
        }            
    }

    const toggleFavorite = e => {
        const classStr = e.target.classList.value
        const username = e.target.closest('div').attributes.username.value
                
        if(classStr.includes('favoriteOff')) {

            const favoriteUsersRenewed = [...favoriteUsers, username]
            setFavoriteUsers(favoriteUsersRenewed)            

            const favoriteUserArr = JSON.parse(localStorage.favoriteUsers)
            const favoriteUserArrClone = [...favoriteUserArr]
            favoriteUserArrClone.push(username)
            localStorage.favoriteUsers = JSON.stringify(favoriteUserArrClone)

        } else {
            
            const userIdx = favoriteUsers.indexOf(username)
            const favoriteUserRenewed = [...favoriteUsers.slice(0, userIdx), 
                                         ...favoriteUsers.slice(userIdx + 1)]
            updateFavoriteUser(favoriteUserRenewed)            
            localStorage.favoriteUsers = JSON.stringify(favoriteUserRenewed)
        }
    }

    const updateFavoriteUser = favoriteUserRenewed => {
        setFavoriteUsers(prevState => {            
            return [...favoriteUserRenewed]
        })
    }

    const removeUserFromHistory = e=> {

        const userName            = e.currentTarget.attributes.username.value        
        const userNameIdx         = queryHistory.indexOf(userName)
        const queryHistoryClone   = [...queryHistory]
        const queryHistoryReNewed = [...queryHistoryClone.slice(0, userNameIdx), ...queryHistoryClone.slice(userNameIdx + 1)]

        setQueryHistory(prev=> [...queryHistoryReNewed])
        localStorage.queryHistory = JSON.stringify(queryHistoryReNewed)
    }

    const onFocusSearchbar = e =>  setIsSearchbarFocused(true)    

    const offFocusSearchbar = e => {
        setIsSearchbarFocused(false)            
    }

    const toggleViewType = e => {
        const viewType = e.target.attributes.viewtype.value 
        setHistoryViewType(_ => viewType)
    }

    const removeFromFavorite = e => {
        const userName = e.currentTarget.attributes.userName.value
        const userIdx =  favoriteUsers.indexOf(userName)
        const favoriteUsersRenewed = [...favoriteUsers.slice(0, userIdx), ...favoriteUsers.slice(userIdx + 1)]
        setFavoriteUsers(favoriteUsersRenewed)
        localStorage.favoriteUsers = JSON.stringify(favoriteUsersRenewed)
    }
        
    function initializeQueryState(){
        searcBarRef.current.value = ''
        setIsInputExists(false)
        offFocusSearchbar()
    }

    function queryUser({username}){        
        getDataAndSetState(username)        
        const queryHistoryArrRenewed = saveQueryToDB(username)
        setQueryHistory(queryHistoryArrRenewed)
        initializeQueryState()
    }

    return (
        <>
            <div className={css.wrapper}>
                <div className={css.userInputWrapper}
                    onBlur={offFocusSearchbar}
                    onFocus={onFocusSearchbar}
                    tabIndex="0"
                >                 
                    <InputQuery 
                        processUserSearch={processUserSearch} 
                        doKeyInputCallback={doKeyInputCallback} searcBarRef={searcBarRef} />

                    { isSearchbarFocused && ! isInputExists && (
                        <div className={css.searchHistory} ref={searchHistoryWrapperRef}>
                            <SearchHistoryHeader toggleHistoryType={toggleViewType} historyViewType={historyViewType} />
                            {historyViewType === 'latestSearch' && (
                                <QueryHistory queryHistory={queryHistory} 
                                    favoriteUsers={favoriteUsers} 
                                    queryUser={queryUser} 
                                    toggleFavorite={toggleFavorite} 
                                    removeUserFromHistory={removeUserFromHistory} 
                                />                                    
                            )}
                            {historyViewType === 'favorite' && (
                                <FavoriteUsers favoriteUsers={favoriteUsers} queryUser={queryUser} removeFromFavorite={removeFromFavorite} />
                            )}                
                        </div>
                    )}
                    {isSearchbarFocused && isInputExists && (
                        <SearchAutocomplete autocompleteEntries={autocompleteEntries} queryUser={queryUser}/>
                    )}
                </div>
            </div>
        </>
    )
}

async function tryCacheForAutocomplete(query){

    const today = new Date().toJSON().slice(0,10)
    const todayCache = localStorage.getItem(today)

    if(!todayCache) {

        localStorage.setItem(today, `{}`)
        const autocompleteEntries = await fetchForAutocomplete(query)
        saveCacheToLocalStorage({today, query, autocompleteEntries})
        return autocompleteEntries
        
    } else {
        const todayCacheObj = JSON.parse(todayCache) 
        const cacheResponse = todayCacheObj[query]

        if(cacheResponse){
            return cacheResponse
        } else {            
            const autocompleteEntries = await fetchForAutocomplete(query)
            saveCacheToLocalStorage({today, query, autocompleteEntries})
            return autocompleteEntries
        }
    }
}

function saveCacheToLocalStorage({today, query, autocompleteEntries}){
    const todayCache = localStorage.getItem(today)
    const todayCacheObj = JSON.parse(todayCache)
    todayCacheObj[query] =  autocompleteEntries
    localStorage.setItem(today, JSON.stringify(todayCacheObj))    
}

function InputQuery({processUserSearch, doKeyInputCallback, searcBarRef}){
    return (
        <div className={css.inputQuery}>
            <form onSubmit={processUserSearch}>
                <input 
                    name='query' 
                    className={css.input_query} 
                    onKeyUp={doKeyInputCallback} 
                    placeholder='소환사명, 챔피언···' 
                    ref={searcBarRef}
                    autoComplete='off'>
                </input>
                <button className={css.submitBtn} type='submit'>
                    <img src="/opgg_search_submit.png"></img>
                </button>
            </form>
        </div>        
    )
}

function QueryHistory({queryHistory, favoriteUsers, queryUser, toggleFavorite, removeUserFromHistory}){

    const URL_IMG_FOR_FAVORITE_ON = "https://opgg-static.akamaized.net/images/site/icon-favorite-on.png"
    const URL_IMG_FOR_FAVORITE_OFF = "https://opgg-static.akamaized.net/images/site/icon-favorite-off.png"
    const URL_IMG_FOR_X_BTN = "/x_btn.png"

    return (
        <div className={css.RecentSummonerListWrap} >        
            {queryHistory.map((userName, userIdx) => {
                const isFavorite = favoriteUsers.some(favUser => favUser === userName)
                return (
                    <div className={css.historyItem} key={userIdx}>                                
                        <div className={css.historyItem}>
                            <div className={css.username} onMouseDown={(e)=>{ queryUser({username :userName} ) }}>
                                {userName}
                            </div>
                            <div className={css.favoriteMark} onMouseDown={toggleFavorite} username={userName}>
                                {isFavorite ? 
                                    <img className={userName + ' ' + 'favoriteOn'} src={URL_IMG_FOR_FAVORITE_ON}></img>
                                    : <img className={userName + ' ' + 'favoriteOff'} src={URL_IMG_FOR_FAVORITE_OFF}></img>}
                            </div>
                            <div className={css.removeMark} onMouseDown={removeUserFromHistory} username={userName}>
                                <img src={URL_IMG_FOR_X_BTN}></img>
                            </div>
                        </div>
                    </div>                                   
                )
            })}        
        </div>
    )
}

function SearchHistoryHeader({toggleHistoryType, historyViewType}){
    
    return (
        <ul className={css.searchHistoryHeader}>
            <li className={historyViewType === `latestSearch` ? css.searchHistoryHeaderUnitOn : css.searchHistoryHeaderUnitOff } 
                onMouseDown={toggleHistoryType} 
                viewtype='latestSearch'>
                    최근검색
            </li>
            <li className={historyViewType === `favorite` ? css.searchHistoryHeaderUnitOn : css.searchHistoryHeaderUnitOff} 
                onMouseDown={toggleHistoryType} 
                viewtype='favorite'>
                    즐겨찾기
            </li>
        </ul>
    )
}

function FavoriteUsers({favoriteUsers, queryUser, removeFromFavorite}){
    return (
        <div className={css.favoriteWrapper}>
        {favoriteUsers.map((user, userIdx)=> {
            return (
                <div className={css.favoriteUnitWrapper} key={userIdx}>
                    <div  onMouseDown={()=> queryUser({username : user})}>
                        {user}
                    </div>
                    <div className={css.removeMark} userName={user} onMouseDown={removeFromFavorite}>
                        <img src="/x_btn.png"></img>      
                    </div>
                </div>
            )
        })}
        </div>
    )
}

function SearchAutocomplete({autocompleteEntries, queryUser}){
    return (
        <div className={css.autoCompleteWrapper}>
            {autocompleteEntries.map((entry, entryIdx)=> {
                const profileURL = entry.profileIconUrl.replace('//', 'https://')
                return (
                    <div key={entryIdx}>
                        <div className={css.autoCompleteItem} onMouseDown={()=> queryUser({username : entry.name}) }>                    
                            <div className={css.autoCompleteUserImgWrapper}>
                                <img  className={css.autoCompleteUserImg} src={profileURL}></img>
                            </div>
                            <div className={css.autoCompleteUserInfoWrapper}>
                                <div className={css.autoCompleteUserName}>{entry.name}</div>
                                <div className={css.autoCompleteUserLevel}>Level {entry.level}</div>
                            </div>
                        </div>       
                    </div>
                )
            })}                 
        </div>       
    )
}