import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useCakeStore } from '../store/useCakeStore';

export const SnapshotListener = () => {
    const { gl, scene, camera } = useThree();
    const { screenshotTrigger, setScreenshotData } = useCakeStore();

    useEffect(() => {
        if (screenshotTrigger > 0) {
           try {
                gl.render(scene, camera);
                const data = gl.domElement.toDataURL('image/png');
                setScreenshotData(data);
           } catch (e) {
               console.error("Snapshot failed", e);
               setScreenshotData('error');
           }
        }
    }, [screenshotTrigger, gl, scene, camera, setScreenshotData]);

    return null;
};
