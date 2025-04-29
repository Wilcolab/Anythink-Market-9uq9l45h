export interface BaseRouter {
    id: number;
    type: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export interface WiFiRouter extends BaseRouter {
    wifiChannels: number[];
    supportsDualBand: boolean;
}

export interface HomeRouter extends BaseRouter {
    connectedDevices: number,
    parentalControlsEnabled: boolean,
    maxBandwidthMbps: number
}

export interface EnterpriseRouter extends BaseRouter {
    supportedProtocols: string[];
}

