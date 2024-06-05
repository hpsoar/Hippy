import React from 'react';
import {
  MemoryRouter,
  Route,
} from 'react-router-dom';
import { View } from '@hippy/react';
import routes from '../routes';
import Header from '../shared/Header';
import Gallery from './gallery';
import { useState } from "react";

const ALL_ROUTES = [{
  path: '/Gallery',
  name: 'Hippy React',
  component: Gallery,
  meta: {
    style: 1,
  },
}, ...routes];

export const Entry = function() {
  const [expand, setExpand] = useState(false);

    const items1 = ['a', 'b', 'c'];
    const items2 = ['a', 'b', 1, 2, 3, 'c'];

    const items = expand ? items2 : items1;

    return (
        <View>
            List Page
            <View><View onClick={() => setExpand(!expand)}>toggle</View></View>
            <View>
                {items.map((item, index) => {
                    if (typeof item === 'string') {
                        return <View key={item}>{item}</View>
                    } else {
                        return <View key={item} style={{'color': 'red'}}>number: {item}</View>
                    }
                })}
            </View>
        </View>
    )
}

export default Entry;

