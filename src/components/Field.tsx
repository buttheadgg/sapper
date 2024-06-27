import React, { FC, useState } from 'react';
import "../styles/App.css";
import {Mask, CellValue } from '../components/types/Types';

interface sizeProps{
    size: number;
}

const Mine = -1;

const Field:FC<sizeProps> = ({size}) => {

    function createField(size:number): number[]{
        const field: number[] = new Array(size*size).fill(0);

        function inc(x:number, y:number){
            if(x >= 0 && x < size && y >= 0 && y < size){
                if(field[y*size+x] === Mine) return;

                field[y*size+x] += 1;
            }
        }

        for(let i=0; i< size;) {

            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);

            if(field[y*size+x] === Mine) continue;

            field[y*size+x] = Mine;

            i+=1;

            inc(x+1,y);
            inc(x-1,y);
            inc(x, y+1);
            inc(x, y-1);
            inc(x+1,y-1);
            inc(x-1, y-1);
            inc(x+1, y+1);
            inc(x-1,y+1);
        }

        return field;
    }


    const mapMaskToView: Record<Mask, React.ReactNode> = {
        [Mask.Transparent]: null,
        [Mask.Fill]: <div className='button'></div>,
        [Mask.Flag]: <div className='flag'></div>,
        [Mask.Question]: <div className='question'></div>
    }

    const dimension = new Array(size).fill(null);

    const [die, setDie] = useState(false);
    const [field, setField] = useState<number[]>(() => createField(size));
    const [mask, setMask] = useState<Mask[]>(() => Array(size*size).fill(Mask.Fill))
    

    return (
        <div>
            {dimension.map((_, y) => {
                return (
                    <div key={y} className='field'>
                        {dimension.map((_,x) => {
                            return (
                                <div 
                                key={x} 
                                className='cell'
                                onClick={() => {
                                    if (mask[y*size+x] === Mask.Transparent) return;

                                    const clearing: [number, number][] = [];

                                    function clear(x:number, y:number){
                                        if(x >= 0 && x < size && y >= 0 && y < size){
                                            if (mask[y*size+x] === Mask.Transparent) return;

                                            clearing.push([x,y]);
                                        }
                                    }

                                    clear(x,y)

                                    while(clearing.length){
                                        const [x, y] = clearing.pop()!!;

                                        mask[y*size+x] = Mask.Transparent;

                                        if (field[y*size+x] !== 0) continue;

                                        clear(x + 1, y);
                                        clear(x - 1, y);
                                        clear(x, y + 1);
                                        clear(x, y - 1);
                                    }

                                    if (field[y * size + x] === Mine){
                                        mask.forEach((_, i) => mask[i] = Mask.Transparent);
                                        console.log('Проебал)))');
                                        setDie(true);
                                    }
                                    setMask((prev) => [...prev]);
                                }}

                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        if (mask[y*size+x] === Mask.Transparent) return;

                                        if (mask[y*size+x] === Mask.Fill) {
                                            mask[y*size+x] = Mask.Flag;
                                        } else if (mask[y*size+x] === Mask.Flag){
                                            mask[y*size+x] = Mask.Question;
                                        } else if (mask[y*size+x] === Mask.Question){
                                            mask[y*size+x] = Mask.Fill;
                                        }

                                        setMask((prev) => [...prev]);

                                    }}
                                >
                                    {
                                     mask[y*size+x] !== Mask.Transparent 
                                     ? mapMaskToView[mask[y*size+x]]
                                     : field[y*size+x] === Mine 
                                        ? <div className='mineDef'></div> 
                                        : field[y*size+x]
                                    }
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    );
};

export default Field;