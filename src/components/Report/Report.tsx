const BATTERYSIZE = 2405;

export interface SteamUser {
    personaname?: string,
}

export interface ReportInterface {
    id?: BigInt
    app_id?: BigInt
    app_build_id?: string
    user_id?: BigInt
    proton_version?: string
    steamos_version?: string
    bios_version?: string
    power_draw?: number
    graphics_preset?: string
    halfrate_shading?: boolean
    resolution_horizontal?: BigInt
    resolution_vertical?: BigInt
    scaling_filter?: string
    framerate_limit?: BigInt
    average_framerate?: BigInt
    tdp_limit?: string
    gpu_clock?: string
    note?: string
    created_at?: string
    updated_at?: string
    favourites_count?: BigInt
    screen_refresh_rate?: BigInt
    user?: SteamUser
}

export interface TableItem {
    label: string
    value: any
}

export interface ShareDeckTable {
    title: string
    rows: TableItem[]
}

export class Report implements ReportInterface {
    id?: BigInt
    app_id?: BigInt
    app_build_id?: string
    user_id?: BigInt
    proton_version?: string
    steamos_version?: string
    bios_version?: string
    power_draw?: number
    graphics_preset?: string
    halfrate_shading?: boolean
    resolution_horizontal?: BigInt
    resolution_vertical?: BigInt
    scaling_filter?: string
    framerate_limit?: BigInt
    average_framerate?: BigInt
    tdp_limit?: string
    gpu_clock?: string
    note?: string
    created_at?: string
    updated_at?: string
    favourites_count?: BigInt
    screen_refresh_rate?: BigInt
    user?: SteamUser

    constructor(data: ReportInterface) {
        this.id = data.id;
        this.app_id = data.app_id;
        this.app_build_id = data.app_build_id;
        this.user_id = data.user_id;
        this.proton_version = data.proton_version;
        this.steamos_version = data.steamos_version;
        this.bios_version = data.bios_version;
        this.power_draw = data.power_draw;
        this.graphics_preset = data.graphics_preset;
        this.halfrate_shading = data.halfrate_shading;
        this.resolution_horizontal = data.resolution_horizontal;
        this.resolution_vertical = data.resolution_vertical;
        this.scaling_filter = data.scaling_filter;
        this.framerate_limit = data.framerate_limit;
        this.average_framerate = data.average_framerate;
        this.tdp_limit = data.tdp_limit;
        this.gpu_clock = data.gpu_clock;
        this.note = data.note;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.favourites_count = data.favourites_count;
        this.screen_refresh_rate = data.screen_refresh_rate;
        this.user = data.user as SteamUser;
    }

    public get resolution() {
        if (this.resolution_vertical && this.resolution_horizontal){
            return this.resolution_horizontal + " x " + this.resolution_vertical;
        }
        return null;
    }

    public get playtime() {
        if (this.power_draw) {
            let minutes = Number(BATTERYSIZE / this.power_draw);
            return `${Math.round(minutes / 60)}h ${Math.round(minutes % 60)}m`
        }
        return null;
    }

    public get fps() {
        if (this.framerate_limit) {
            return `${this.average_framerate}/${this.framerate_limit}fps`
        }
        return `${this.average_framerate}fps`
    }
    
    _format_fps(value: any) {
        if (value) {
            return `${value}fps`
        }
        return null;
    }

    public get fps_limit() {
        return this._format_fps(this.framerate_limit);
    }

    public get fps_avg() {
        return this._format_fps(this.average_framerate);
    }

    public get fps_refresh() {
        return this._format_fps(this.screen_refresh_rate);
    }

    public get tdp() {
        return `${this.tdp_limit}w`
    }

    public get header() {
        return `${this.playtime} | ${this.power_draw}w | ${this.fps} | ${this.graphics_preset}`
    }

    public get system_table() {
        let table = {title: 'SYSTEM', rows: []} as ShareDeckTable;
        if (this.proton_version) {
            table.rows.push({label: "proton version", value: this.proton_version})
        }
        if (this.steamos_version) {
            table.rows.push({label: "steamos version", value: this.steamos_version})
        }
        if (this.bios_version) {
            table.rows.push({label: "bios version", value: this.bios_version})
        }
        return table;
    }

    public get configuration_table() {
        let table = {title: 'CONFIGURATION', rows: []} as ShareDeckTable;
        if (this.graphics_preset) {
            table.rows.push({label: "graphics preset", value: this.graphics_preset})
        }
        if (this.screen_refresh_rate) {
            table.rows.push({label: "screen refresh rate", value: this.fps_refresh})
        }
        if (this.framerate_limit) {
            table.rows.push({label: "framerate limit", value: this.fps_limit})
        }
        if (this.average_framerate) {
            table.rows.push({label: "average framerate", value: this.fps_avg})
        }
        if (this.tdp_limit) {
            table.rows.push({label: "tdp limit", value: this.tdp})
        }
        if (this.resolution) {
            table.rows.push({label: "resolution", value: this.resolution})
        }
        return table;
    }

    public get tables() {
        return [
            this.configuration_table,
            this.system_table,
        ]
    }
}
