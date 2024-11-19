package com.varc.brewnetapp.domain.member.query.controller;

import com.varc.brewnetapp.common.ResponseMessage;
import com.varc.brewnetapp.domain.member.query.dto.CompanyDTO;
import com.varc.brewnetapp.domain.member.query.dto.MemberDTO;
import com.varc.brewnetapp.domain.member.query.dto.SealDTO;
import com.varc.brewnetapp.domain.member.query.service.CompanyService;
import com.varc.brewnetapp.domain.member.query.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("queryMemberController")
@RequestMapping("api/v1")
public class MemberController {

    private final MemberService memberService;
    private final CompanyService companyService;

    @Autowired
    public MemberController(MemberService memberService, CompanyService companyService) {
        this.memberService = memberService;
        this.companyService = companyService;
    }

    @GetMapping("/member")
    @Operation(summary = "멤버 목록 조회 API / query param으로 page와 size를 키값으로 데이터 보내주시면 됩니다 / page는 1부터 시작")
    public ResponseEntity<ResponseMessage<Page<MemberDTO>>> findMemberList(@PageableDefault(value = 10) Pageable page) {
        // 페이지네이션
        Page<MemberDTO> result = memberService.findMemberList(page);
        return ResponseEntity.ok(new ResponseMessage<>(200, "멤버 목록 조회 성공", result));
    }

    @GetMapping("/company")
    @Operation(summary = "회사 정보 조회 API")
    public ResponseEntity<ResponseMessage<CompanyDTO>> findCompany() {
        return ResponseEntity.ok(new ResponseMessage<>(200, "회사 정보 조회 성공", companyService.findCompany()));
    }

    @GetMapping("/company/seal")
    @Operation(summary = "법인 인감 조회 API")
    public ResponseEntity<ResponseMessage<SealDTO>> findCompanySeal() {
        return ResponseEntity.ok(new ResponseMessage<>(200, "인감 조회 성공", companyService.findCompanySeal()));
    }

    @GetMapping("/member/detail")
    @Operation(summary = "멤버 상세 조회 API / 토큰에 들어 있는 아이디 값에 해당하는 유저의 정보를 보여줌")
    public ResponseEntity<ResponseMessage<MemberDTO>> findMember(@RequestHeader("Authorization") String accessToken) {

        return ResponseEntity.ok(new ResponseMessage<>(200, "멤버 조회 성공", memberService.findMember(accessToken)));
    }




}
