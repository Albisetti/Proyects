<?php

namespace App\GraphQL\Queries;

use Google_Client;
use Google_Service_AnalyticsReporting;
use Google_Service_AnalyticsReporting_DateRange;
use Google_Service_AnalyticsReporting_Dimension;
use Google_Service_AnalyticsReporting_GetReportsRequest;
use Google_Service_AnalyticsReporting_Metric;
use Google_Service_AnalyticsReporting_ReportRequest;

class GoogleAnalyticsData
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        
        $client = new Google_Client();
        $client->setAuthConfig(__DIR__ . '/../../../config/creds.json');

        $client->setScopes(['https://www.googleapis.com/auth/analytics.readonly']);
        $analytics = new Google_Service_AnalyticsReporting($client);

      
        $dateRange = new Google_Service_AnalyticsReporting_DateRange();
        $dateRange->setStartDate("2021-10-03");
        $dateRange->setEndDate("today");

        // $clientId2 = new Google_Service_AnalyticsReporting_Dimension();
        // $clientId2->setName("ga:250248813");
      
        $sessions = new Google_Service_AnalyticsReporting_Metric();
        $sessions->setExpression("ga:totalEvents");
        $sessions->setAlias("totalEvents");

        $clientId = new Google_Service_AnalyticsReporting_Dimension();
        $clientId->setName("ga:eventLabel");

        $clientId1 = new Google_Service_AnalyticsReporting_Dimension();
        $clientId1->setName("ga:eventAction");
      
        $request = new Google_Service_AnalyticsReporting_ReportRequest();
        $request->setViewId(config('analytics.views.view_id'));
        $request->setDateRanges($dateRange);
        
        $request->setMetrics([
            $sessions
        ]);
        $request->setDimensions([
            $clientId,
            $clientId1,
        ]);
      
        $body = new Google_Service_AnalyticsReporting_GetReportsRequest();
        $body->setReportRequests([$request]);
        return json_encode($analytics->reports->batchGet($body));
    }
}