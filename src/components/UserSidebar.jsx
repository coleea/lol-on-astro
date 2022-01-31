import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import {userSidebarInfoAtom}  from '../recoil/summonerInfo'

import css from './UserSidebar.module.scss' 
import UserChampionsWinRatio from './UserSidebar/UserChampionsWinRatio.jsx'
import UserRankInfo from './UserSidebar/UserRankInfo.jsx'

const winRatioTypeMapper = {
    freeSeasion : 0,
    _7days : 1 ,
}

export default function UserSidebar() {

    const [userSidebarInfo, setUserSidebarInfo]  = useRecoilState(userSidebarInfoAtom)
    const [winRatioType, setWinRatioType] = useState(winRatioTypeMapper.freeSeasion)
    const winRatioInfo =  userSidebarInfo ? 
                                (winRatioType === winRatioTypeMapper.freeSeasion) ? 
                                                                        userSidebarInfo.winRatioFreeSeason 
                                                                        : userSidebarInfo.winRatio7Days
                                : null 

    return (
        <>
            <div className={css.wrapper}>
                <UserRankInfo/>
                <UserChampionsWinRatio  />
            </div>
        </>
    )
}