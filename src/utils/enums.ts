enum DevelopmentType {
    PHYSICAL = 'PHYSICAL',
    COGNITIVE = 'COGNITIVE',
    MENTAL = 'MENTAL'
};

enum UserType {
    USER = 'USER',
    GUEST = 'GUEST'
}

enum Sex {
    M = 'M',
    F = 'F'
};

enum TipsType {
    VIDEO = 'VIDEO',
    TEXT = 'TEXT'
}

enum StatusChildActivityEnum {
    COMPLETE = 'COMPLETE',
    IN_PROGRESS = 'IN_PROGRESS',
    FAILED = 'CANCELLED'
};

enum MoodEnum {
    TIRED = 'TIRED',
    NEUTRAL = 'NEUTRAL',
    GREAT = 'GREAT'
};

enum InterrgationEnum {
    WEEK = 'WEEK',
    MONTH = 'MONTH'
}

enum InterrgationStatusEnum {
    IN_PROGRESS = 'IN_PROGRESS',
    FINISH = 'FINISH',
    SKIP = 'SKIP'
}

export {
    DevelopmentType,
    UserType,
    Sex,
    TipsType,
    StatusChildActivityEnum,
    MoodEnum,
    InterrgationEnum,
    InterrgationStatusEnum
}