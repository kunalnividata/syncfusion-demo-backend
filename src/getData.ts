import { names, getRandomDataBetween, getRandomData, dataTypeFormats } from "./utilities";
import { SampleDataModel } from "./utilities/GetDataModel";
import fs from 'fs';
import path from 'path';

const sampleData: SampleDataModel = {
    data: [],
    metaData: {
        col1: {
            name: 'RowId',
            dataType: 'number',
        },
        col2: {
            name: 'Name',
            dataType: 'string',
        },
        col3: {
            name: 'Age',
            dataType: 'number',
        },
        col4: {
            name: 'exField1',
            dataType: 'number',
        },
        col5: {
            name: 'exField2',
            dataType: 'number',
        }
    },
};

const generateJsonFile = () => {
    let parent = -1;
    const subRows = 'subRows';
    const { data } = sampleData;
    for (let i = 0; i < 50000; i++) {
        if (i % 5 === 0) {
            parent = i;
        }
        if (i % 5 !== 0) {
            const num: number = isNaN((data.length % parent) - 1) ? 0 : (data.length % parent) - 1;
            data[num][subRows].push({
                col1: i + 1,
                col2: names[Math.floor(Math.random() * names.length)],
                col3: getRandomDataBetween(20, 40),
                col4: getRandomData(200),
                col5: getRandomData(100)
            })
        } else {
            data.push({
                col1: i + 1,
                col2: names[Math.floor(Math.random() * names.length)],
                col3: getRandomDataBetween(20, 40),
                col4: getRandomData(200),
                col5: getRandomData(100),
                [subRows]: []
            });
        }
    }

    fs.writeFile('./dist/sampleTreegrid.json', JSON.stringify(sampleData), 'utf-8', () => {
        console.log('file is written');
    })
}

const getSampleData = (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(path.join(__dirname, './sampleTreegrid.json'));
}

const modifyJson = (req, res) => {
    res.sendFile(path.join(__dirname, '/../src/views/index.html'));
}

const getModifiedData = (sampleData, selectedColumn, dataType, defaultValue) => {
    return sampleData.data.map((item) => {
        const modifiedItem = { ...item };
        modifiedItem.subRows = modifiedItem.subRows.map((subItem) => {
            subItem[selectedColumn] = dataType ? dataTypeFormats[dataType]() : defaultValue;
            return subItem;
        });
        modifiedItem[selectedColumn] = dataType ? dataTypeFormats[dataType]() : defaultValue;
        return modifiedItem;
    });
}

const writeToJsonFile = (updatedSampleData) => {
    fs.writeFile('./dist/sampleTreegrid.json', JSON.stringify(updatedSampleData), 'utf-8', () => {
        console.log('file is updated');
    });
}

const editColumn = (formData, socket) => {
    const { selectedColumn, colName, defaultValue, dataType } = formData;

    // let specificColumn = isForAdd ? 'col' + Object.keys(sampleData.metaData).length + 1 : selectedColumn;

    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    }
    if (updatedSampleData.metaData[selectedColumn].dataType != dataType) {
        updatedSampleData.data = getModifiedData(sampleData, selectedColumn, dataType, defaultValue);
    }
    updatedSampleData.metaData[selectedColumn].name = colName;

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        formData
    }
    socket.emit('getUpdatedData', updatedData);
}

const addColumn = (formData, socket) => {
    const { colName, defaultValue, dataType } = formData;

    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    }
    const field = 'col' + Object.keys(sampleData.metaData).length + 1;
    updatedSampleData.metaData[field] = {
        name: colName,
        dataType: dataType
    };
    
    updatedSampleData.data = updatedSampleData.data = getModifiedData(sampleData, field, dataType, defaultValue);

    writeToJsonFile(updatedSampleData);
    
    const updatedData = {
        sampleData: updatedSampleData,
        formData
    }

    socket.emit('getUpdatedData', updatedData)
}

export { generateJsonFile, getSampleData, modifyJson, editColumn, addColumn };