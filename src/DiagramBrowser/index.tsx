import React, { FC, useEffect, useRef, useState } from 'react';
import { DiagramBrowserProps } from './types';

import styles from './styles.module.css';
// import cx from 'classnames';

import { DiagramLayer } from '../DiagramLayer';
import { LayerInfo } from '../service/types';

import { DiagramBrowserLoader } from './diagram-browser-loader';

export const DiagramBrowser: FC<DiagramBrowserProps> = ({ diagramSource, rootDn, initialExpandedDn, viewOptions }) => {

    const contentRef = useRef<HTMLDivElement>(null);

    const [loader, setLoader] = useState<DiagramBrowserLoader | null>(null);
    const [layers, setLayers] = useState<LayerInfo[]>([]);

    useEffect(() => {
        const l = new DiagramBrowserLoader(rootDn, diagramSource, viewOptions, initialExpandedDn);

        const subscriber = l.onLayersChange((layers) => {
            setLayers(layers);
        })

        setLoader(l);

        return () => {
            setLoader(null);
            l.close();
            subscriber.close();
        };
    }, []);

    return <>


        <div className={styles.container}>

            <div className={styles.content}
                 ref={contentRef}>

                {loader && layers.map((layer, index) => 

                    // <div key={index}>
                    //     <pre>
                    //         {JSON.stringify(layer, null, 4)}
                    //     </pre>
                    // </div>

                    <DiagramLayer key={index}
                                  loader={loader}
                                  layer={layer}
                                  scrollBoundaryRef={contentRef}
                                  viewOptions={viewOptions}
                                  />
                    
                )}

            </div>

        </div>
       
    </>
}