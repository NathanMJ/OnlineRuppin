import React from 'react'

export default function SettingsCafeMain(props) {

    if(!props.show){
        return
    }

    const getManagerSections = () => {
        if (props.isManager) {
            return <div className='managerSections'>

                <div className='reduction'>
                    <img src="" alt="" />
                    <p>Reduction</p>
                </div>

                <div className='emptyATable'>
                    <img src="" alt="" />
                    <p>Empty a table</p>
                </div>

                <div className='removeAnOrder'>
                    <img src="" alt="" />
                    <p>Remove an order</p>
                </div>

            </div>
        }
    }

    return (
        <div className='settingsCafeMain'>

            <div className='payment'>
                <img src="" alt="" />
                <p>Payement</p>
            </div>

            <div className='switchTable'>
                <img src="" alt="" />
                <p>Switch tables</p>
            </div>

            <div className='history'>
                <img src="" alt="" />
                <p>History's day</p>
            </div>

            {getManagerSections()}

            <div className='background'></div>

        </div>
    )
}
