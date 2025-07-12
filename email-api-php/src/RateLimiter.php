<?php

namespace WealthScore;

class RateLimiter
{
    private $requests = [];
    private $maxRequests;
    private $timeWindow;

    public function __construct(int $maxRequests = 5, int $timeWindow = 60)
    {
        $this->maxRequests = $maxRequests;
        $this->timeWindow = $timeWindow;
        $this->cleanupOldRequests();
    }

    /**
     * Check if request is allowed for given IP
     * 
     * @param string $ip
     * @return bool
     */
    public function isAllowed(string $ip): bool
    {
        $this->cleanupOldRequests();
        
        if (!isset($this->requests[$ip])) {
            $this->requests[$ip] = [];
        }

        $currentTime = time();
        $requestsInWindow = array_filter($this->requests[$ip], function($timestamp) use ($currentTime) {
            return ($currentTime - $timestamp) < $this->timeWindow;
        });

        if (count($requestsInWindow) >= $this->maxRequests) {
            return false;
        }

        $this->requests[$ip][] = $currentTime;
        return true;
    }

    /**
     * Get remaining requests for IP
     * 
     * @param string $ip
     * @return int
     */
    public function getRemainingRequests(string $ip): int
    {
        $this->cleanupOldRequests();
        
        if (!isset($this->requests[$ip])) {
            return $this->maxRequests;
        }

        $currentTime = time();
        $requestsInWindow = array_filter($this->requests[$ip], function($timestamp) use ($currentTime) {
            return ($currentTime - $timestamp) < $this->timeWindow;
        });

        return max(0, $this->maxRequests - count($requestsInWindow));
    }

    /**
     * Get time until next request is allowed
     * 
     * @param string $ip
     * @return int
     */
    public function getRetryAfter(string $ip): int
    {
        if (!isset($this->requests[$ip])) {
            return 0;
        }

        $currentTime = time();
        $oldestRequest = min($this->requests[$ip]);
        $timePassedSinceOldest = $currentTime - $oldestRequest;
        
        if ($timePassedSinceOldest >= $this->timeWindow) {
            return 0;
        }

        return $this->timeWindow - $timePassedSinceOldest;
    }

    /**
     * Clean up old requests that are outside the time window
     */
    private function cleanupOldRequests(): void
    {
        $currentTime = time();
        
        foreach ($this->requests as $ip => $timestamps) {
            $this->requests[$ip] = array_filter($timestamps, function($timestamp) use ($currentTime) {
                return ($currentTime - $timestamp) < $this->timeWindow;
            });
            
            if (empty($this->requests[$ip])) {
                unset($this->requests[$ip]);
            }
        }
    }

    /**
     * Get rate limit info
     * 
     * @return array
     */
    public function getRateLimitInfo(): array
    {
        return [
            'max_requests' => $this->maxRequests,
            'time_window' => $this->timeWindow,
            'window_description' => "{$this->maxRequests} requests per {$this->timeWindow} seconds"
        ];
    }
} 