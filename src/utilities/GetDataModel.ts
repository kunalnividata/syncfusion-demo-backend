type MetaData = {
    [propName: string]: {
        name: string;
        dataType: string;
    };
}

type FieldValue =  number | string | Date | boolean;

interface DynamicModel {
    [propName: string]: FieldValue; 
}

export interface SampleDynamicDataModel {
   [propName: string]: FieldValue | Array<DynamicModel>;
   subRows?: Array<DynamicModel>;
}

export interface SampleDataModel {
    metaData: MetaData;
    data: SampleDynamicDataModel[]
}