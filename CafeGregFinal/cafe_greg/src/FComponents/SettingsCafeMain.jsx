import React from 'react'

export default function SettingsCafeMain(props) {

    if(!props.show){
        return
    }

    const clickOnSection = (section) => {
        console.log(section);
        props.hideMsg()
    }


    const getManagerSections = () => {
        if (props.isManager) {
            return <div className='managerSections'>

                <div className='reduction' onClick={() => clickOnSection('reduction')}>
                    <img src="https://static.vecteezy.com/system/resources/previews/023/171/828/non_2x/percent-down-icon-discount-illustration-sign-reduction-of-royalties-symbol-or-logo-vector.jpg"/>
                    <p>Reduction</p>
                </div>

                <div className='emptyATable' onClick={() => clickOnSection('emptyATable')}>
                    <img src="https://png.pngtree.com/png-vector/20190927/ourmid/pngtree-trash-icon-png-image_1753315.jpg"/>
                    <p>Empty a table</p>
                </div>

                <div className='removeAnOrder' onClick={() => clickOnSection('removeAnOrder')}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3687/3687412.png"/>
                    <p>Remove an order</p>
                </div>

            </div>
        }
    }

    return (
        <div className='settingsCafeMain'>

            <div className='payment' onClick={() => clickOnSection('payment')}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN79yIhZH66SbM3eor1zCFG65S-LfSqFpoxoRR-336-pgUkINFCXZwEt8D2qYQ7uPM9cs&usqp=CAU" />
                <p>Payement</p>
            </div>

            <div className='switchTable' onClick={() => clickOnSection('switchTable')}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi09vu7pWKVz3FpTlaljOcKknKDwEnruZsrA&s" />
                <p>Switch tables</p>
            </div>

            <div className='history' onClick={() => clickOnSection('history')}>
                <img src="https://cdn-icons-png.flaticon.com/512/32/32223.png"/>
                <p>History's day</p>
            </div>

            {getManagerSections()}

            <div className='background'></div>

        </div>
    )
}
