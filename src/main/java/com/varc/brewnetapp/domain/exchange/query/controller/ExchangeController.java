package com.varc.brewnetapp.domain.exchange.query.controller;

import com.varc.brewnetapp.common.ResponseMessage;
import com.varc.brewnetapp.domain.exchange.query.aggregate.vo.*;
import com.varc.brewnetapp.domain.exchange.query.service.ExchangeServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController("ExchangeControllerQuery")
@RequiredArgsConstructor
@RequestMapping("/api/v1/exchange")
@Slf4j
public class ExchangeController {

    private final ExchangeServiceImpl exchangeService;

    @GetMapping("")
    @Operation(summary = "[본사] 교환요청 목록 조회 API")
    public ResponseEntity<ResponseMessage<Page<ExchangeListVO>>> findExchangeList(
            @PageableDefault(value = 10) Pageable page) {

        // 페이지네이션
        Page<ExchangeListVO> result = exchangeService.findExchangeList(page);
        return ResponseEntity.ok(new ResponseMessage<>(200, "교환요청 목록 조회 성공", result));
    }

    @GetMapping("/search")
    @Operation(summary = "[본사] 교환요청 목록 검색 API",
            description = "searchFilter에 들어갈 수 있는 값은 exchangeCode(교환번호), franchiseName(교환지점), managerName(교환지점) 3가지<br>" +
                    "생성일자로 검색하고 싶은 경우 startDate(검색시작일), endDate(검색마지막일)을 입력<br>" +
                    "3가지 검색 조건과 생성일자 검색은 AND로 함께 필터링 검색 가능")
    public ResponseEntity<ResponseMessage<Page<ExchangeListVO>>> searchExchangeList(
            @RequestParam(required = false) String searchFilter,
            @RequestParam(required = false) String searchWord,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @PageableDefault(value = 10) Pageable page) {

        Page<ExchangeListVO> result = exchangeService.searchExchangeList(searchFilter, searchWord, startDate, endDate, page);

        return ResponseEntity.ok(new ResponseMessage<>(200, "교환요청 목록 검색 성공", result));
    }

    @GetMapping("/{exchangeCode}")
    @Operation(summary = "[본사] 교환요청 상세조회 API")
    public ResponseEntity<ResponseMessage<ExchangeDetailVO>> findExchangeBy(@PathVariable("exchangeCode") Integer exchangeCode) {

        ExchangeDetailVO result = exchangeService.findExchangeDetailBy(exchangeCode);
        return ResponseEntity.ok(new ResponseMessage<>(200, "교환요청 상세조회 성공", result));
    }

    @GetMapping("/history")
    @Operation(summary = "[본사] 타부서 교환처리내역 목록 조회 API")
    public ResponseEntity<ResponseMessage<Page<ExchangeHistoryVO>>> findExchangeHistoryList(@PageableDefault(value = 10) Pageable page) {
        Page<ExchangeHistoryVO> result = exchangeService.findExchangeHistoryList(page);
        return ResponseEntity.ok(new ResponseMessage<>(200, "타부서 교환처리내역 목록조회 성공", result));
    }

    @GetMapping("/history/search")
    @Operation(summary = "[본사] 타부서 교환처리내역 목록 검색 API",
            description = "searchFilter에 들어갈 수 있는 값은 code(처리번호), manager(처리담당자), exchangeCode(교환번호), exchangeManager(교환담당자) 4가지<br>" +
                    "생성일자로 검색하고 싶은 경우 startDate(검색시작일), endDate(검색마지막일)을 입력<br>" +
                    "4가지 검색 조건과 생성일자 검색은 AND로 함께 필터링 검색 가능")
    public ResponseEntity<ResponseMessage<Page<ExchangeHistoryVO>>> searchExchangeHistoryList(
            @RequestParam(required = false) String searchFilter,
            @RequestParam(required = false) String searchWord,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @PageableDefault(value = 10) Pageable page) {

        Page<ExchangeHistoryVO> result = exchangeService.searchExchangeHistoryList(searchFilter, searchWord, startDate, endDate, page);

        return ResponseEntity.ok(new ResponseMessage<>(200, "교환요청 목록 검색 성공", result));
    }

    @GetMapping("/history/{exchangeStockHistoryCode}")
    @Operation(summary = "[본사] 타부서 교환처리내역 상세조회 API")
    public ResponseEntity<ResponseMessage<ExchangeHistoryDetailVO>> findExchangeHistoryBy(@PathVariable("exchangeStockHistoryCode") Integer exchangeStockHistoryCode) {

        ExchangeHistoryDetailVO result = exchangeService.findExchangeHistoryDetailBy(exchangeStockHistoryCode);
        return ResponseEntity.ok(new ResponseMessage<>(200, "타부서 교환처리내역 상세조회 성공", result));
    }

    // code -> access token 정보로 수정 필요
    // url 수정 필요
    @GetMapping("/franchise/list")
    @Operation(summary = "[가맹점] 교환요청 목록조회 API")
//    @SecurityRequirement(name = "Authorization")
    public ResponseEntity<ResponseMessage<Page<FranExchangeListVO>>> findFranExchangeList(@RequestAttribute("loginId") String loginId,
                                                                                          @PageableDefault(value = 10) Pageable page) {
        Page<FranExchangeListVO> result = exchangeService.findFranExchangeList(loginId, page);
        return ResponseEntity.ok(new ResponseMessage<>(200, "가맹점 교환요청 목록조회 성공", result));
    }

    @GetMapping("/franchise/search")
    @Operation(summary = "[가맹점] 교환요청 목록 검색 API",
            description = "searchFilter에 들어갈 수 있는 값은 exchangeCode(교환번호), itemName(품목명) 2가지<br>" +
                    "생성일자로 검색하고 싶은 경우 startDate(검색시작일), endDate(검색마지막일)을 입력<br>" +
                    "2가지 검색 조건과 생성일자 검색은 AND로 함께 필터링 검색 가능")
//    @SecurityRequirement(name = "Authorization")
    public ResponseEntity<ResponseMessage<Page<FranExchangeListVO>>> searchFranExchangeList(
            @RequestAttribute("loginId") String loginId,
            @RequestParam(required = false) String searchFilter,
            @RequestParam(required = false) String searchWord,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @PageableDefault(value = 10) Pageable page) {

        Page<FranExchangeListVO> result = exchangeService.searchFranExchangeList(loginId, searchFilter, searchWord, startDate, endDate, page);

        return ResponseEntity.ok(new ResponseMessage<>(200, "가맹점 교환요청 목록 검색 성공", result));
    }

    @GetMapping("/franchise/{exchangeCode}")
    @Operation(summary = "[가맹점] 교환요청 상세조회 API")
    public ResponseEntity<ResponseMessage<FranExchangeDetailVO>> findFranExchangeDetail(@RequestAttribute("loginId") String loginId,
                                                                                        @PathVariable("exchangeCode") Integer exchangeCode) {

        FranExchangeDetailVO result = exchangeService.findFranExchangeDetailBy(loginId, exchangeCode);
        return ResponseEntity.ok(new ResponseMessage<>(200, "가맹점 교환요청 상세조회 성공", result));
    }

    @GetMapping("/franchise/status/{exchangeCode}")
    @Operation(summary = "[가맹점] 교환요청 상세조회 - 교환상태조회 API")
    public ResponseEntity<ResponseMessage<List<FranExchangeStatusVO>>> findFranExchangeStatus(@RequestAttribute("loginId") String loginId,
                                                                                              @PathVariable("exchangeCode") Integer exchangeCode) {

        List<FranExchangeStatusVO> result = exchangeService.findFranExchangeStatusBy(loginId, exchangeCode);
        return ResponseEntity.ok(new ResponseMessage<>(200, "가맹점 교환요청 상세조회 성공", result));
    }

    @GetMapping("/approver/{exchangeCode}")
    @Operation(summary = "[본사] 교환요청 상세조회 - 결재진행상태 API")
    public ResponseEntity<ResponseMessage<List<ExchangeApproverVO>>> findExchangeApprover(@RequestAttribute("loginId") String loginId,
                                                                                          @PathVariable("exchangeCode") Integer exchangeCode) {

        List<ExchangeApproverVO> result = exchangeService.findExchangeApprover(loginId, exchangeCode);
        return ResponseEntity.ok(new ResponseMessage<>(200, "교환 결재진행상태 조회 성공", result));
    }
}
