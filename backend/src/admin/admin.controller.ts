import { Controller, Post, Body, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AccountRequestService } from 'src/account-request/account-request.service';

// @Roles(Role.Admin)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(private accountRequestService:  AccountRequestService){}

    /**
     * 
     * @returns list of ids ["uuid1", "uuid2" ...]
     */

    @Get("requests")
    async getAccountRequests(){
        return this.accountRequestService.getAllRequestTokens();
    }

    /**
     * 
     * @param tokenId handler receives token id which is used to fetch token information
     * @returns if succcessfull HTTPstatus ok
     * this endpoint uses token id to fetch the token and email of RequestToken model
     * and then sends an initation link to the email containing the respective token
     */

    @Post("requests/approve")
    @HttpCode(HttpStatus.OK)
    async approveAccountRequest(@Body("tokenId") tokenId: string): Promise<{ status: HttpStatus; message: string }> {
        await this.accountRequestService.approveAccountRequest(tokenId)
        return {
            status: HttpStatus.OK,
            message: "Account approved!"
        }
    }
}
