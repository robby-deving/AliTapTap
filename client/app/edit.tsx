import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { Header } from '@/components/Header';


export default function Edit() {  
    const [isPressed, setIsPressed] = useState(false);

    return (
        <View className='h-full bg-white'>
            <Header />
            
            <View className='flex-1 bg-[#F5F5F5] rounded-b-[40px] mb-5'>
                <View className='flex flex-col items-center p-10'>
                    <View className='flex flex-row justify-between'>
                        <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300]">
                            Front Design
                        </Text>
                    </View>
                </View>

                
                <View>

                </View>
            </View>
            <View className='flex flex-row gap-10 px-10 mb-10'>
                <View className='flex flex-row gap-5'>
                    <TouchableOpacity className='flex flex-col items-center'>
                        <Image
                        source={require('../assets/images/text-icon.png')}
                        className='w-[25px] h-[25px] mb-2'
                        />
                        <Text className='font-semibold'>Add Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='flex flex-col items-center'>
                        <Image
                        source={require('../assets/images/img-icon.png')}
                        className='w-[25px] h-[25px] mb-2'
                        />
                        <Text className='font-semibold'>Add Image</Text>
                    </TouchableOpacity>
                </View>
                <View className='flex-1'>
                    <TouchableOpacity 
                        className={`${isPressed ? 'bg-white border border-[#FDCB07]' : 'bg-[#FDCB07]'} w-full p-4 rounded`}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                    >
                        <Text className={`${isPressed ? 'text-[#FDCB07]' : 'text-white'} text-center text-xl font-semibold`}>
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
  }
