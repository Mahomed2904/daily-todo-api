import { Injectable } from '@nestjs/common';

@Injectable()
export class CodegeneratorService {
    generateCode() {
        const LIMIT = 10;
        let code = '';
        for (let i = 0; i < 6; ++i) {
            code += Math.floor(LIMIT * Math.random());
        }
        return code;
    }
}
